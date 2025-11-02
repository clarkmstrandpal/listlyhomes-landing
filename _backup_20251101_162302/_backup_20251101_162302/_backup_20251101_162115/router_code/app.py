import os, json, time, boto3, uuid
from common.resp import response
from common.ssm import get_json_param

dynamodb = boto3.resource("dynamodb")
sendlog = dynamodb.Table(os.environ["TABLE_SENDLOG"])

def _http_method(event):
    m = event.get("httpMethod")
    if m: return m.upper()
    # HTTP API v2 shape
    try:
        m = event.get("requestContext", {}).get("http", {}).get("method")
        return (m or "").upper()
    except Exception:
        return ""

def handler(event, context):
    method = _http_method(event)
    if method != "POST":
        return response(405, {"error": "method not allowed"})

    routes = get_json_param(os.environ["SLACK_ROUTE_PARAM"])

    raw_body = event.get("body") or "{}"
    if isinstance(raw_body, (bytes, bytearray)):
        raw_body = raw_body.decode("utf-8")
    data = json.loads(raw_body)

    category = (data.get("category") or "default").lower()
    target = routes.get(category, routes.get("default"))

    audit = {
        "log_id": str(uuid.uuid4()),
        "sent_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "category": category,
        "target": target,
        "payload": data
    }
    sendlog.put_item(Item=audit)
    return response(200, {"routed": True, "category": category})
