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
        resp.set_cookie(
            'user_id', 
            str(os.urandom(10).hex()),
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
    socketio.emit('message received', {
        'message': message,
        'user_id' : user_id
    })

if __name__ == '__main__': 
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=int(os.getenv('PORT', 8080)),
        debug=True
    )
