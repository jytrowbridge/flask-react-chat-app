import os
from flask import Flask, request, render_template, make_response, session
import flask_socketio
import random

app = Flask(__name__)
socketio = flask_socketio.SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")
app.secret_key = b'\x0f}\x88\xb3\x16\x0fnfC\x7f\x0c\x1e\xb2OSt\xcem\xa5\x04X\xd8\xba<'

@app.route('/')
def index():
    resp = make_response(render_template('index.html'))
    print(session)
    if not request.cookies.get('user_id'):
        id = str(os.urandom(10).hex())
        resp.set_cookie(
                'user_id',
                id,
                samesite='Strict'
            )
        resp.set_cookie(
                'user_name',
                id,
                samesite='Strict'
            )
    return resp

@socketio.on('connect')
def on_connect():
    print('Someone connected!')
    socketio.emit('connected', {
        'test': 'Connected'
    })

@socketio.on('disconnect')
def on_disconnect():
    print ('Someone disconnected!')

@socketio.on('send:message')
def send_message(data):
    print("Got an event for new message with data:", data)
    message = data['message']
    user_id = data['user_id']
    user_name = data['user_name']
    socketio.emit('message received', {
        'message': message,
        'user_id' : user_id,
        'user_name' : user_name
    })

@socketio.on('update_username')
def change_username(data):
    print("Got change_username event with data: ", data)
    user_id = data['user_id']
    user_name = data['user_name']
    socketio.emit('change username', data)


if __name__ == '__main__': 
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=int(os.getenv('PORT', 80)),
        debug=True
    )
