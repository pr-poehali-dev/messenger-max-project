import json
import os
import secrets
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
}

def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """Проверить OTP-код и создать сессию пользователя"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    phone = (body.get('phone') or '').strip()
    code = (body.get('code') or '').strip()
    name = (body.get('name') or 'Пользователь').strip()

    if not phone or not code:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Укажите телефон и код'})}

    schema = os.environ.get('MAIN_DB_SCHEMA', 't_p24027735_messenger_max_projec')
    conn = get_db()
    cur = conn.cursor()

    # Проверяем OTP
    cur.execute(
        f"SELECT id FROM {schema}.otp_codes WHERE phone=%s AND code=%s AND used=FALSE AND expires_at > NOW() ORDER BY id DESC LIMIT 1",
        (phone, code)
    )
    row = cur.fetchone()
    if not row:
        cur.close()
        conn.close()
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Неверный или истёкший код'})}

    otp_id = row[0]
    cur.execute(f"UPDATE {schema}.otp_codes SET used=TRUE WHERE id=%s", (otp_id,))

    # Upsert пользователя
    cur.execute(
        f"INSERT INTO {schema}.users (phone, name) VALUES (%s, %s) ON CONFLICT (phone) DO UPDATE SET phone=EXCLUDED.phone RETURNING id, name",
        (phone, name)
    )
    user = cur.fetchone()
    user_id, user_name = user[0], user[1]

    # Создаём токен сессии
    token = secrets.token_hex(32)
    cur.execute(
        f"INSERT INTO {schema}.sessions (token, user_id) VALUES (%s, %s)",
        (token, user_id)
    )
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({
            'ok': True,
            'token': token,
            'user': {'id': user_id, 'name': user_name, 'phone': phone}
        })
    }
