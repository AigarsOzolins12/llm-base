from django.shortcuts import render
from django.http import StreamingHttpResponse, HttpRequest, HttpResponse
from ollama import Client, Message
from rest_framework.decorators import api_view
from rest_framework import status
from typing import Sequence, Generator
from .serializers import ChatStateSerializer
import os

@api_view(['POST'])
def generate_ollama(request: HttpRequest):
    print("request.user.is_authenticated => ", request.user.is_authenticated)
    
    serializer: ChatStateSerializer = ChatStateSerializer(data=request.data)
    if serializer.is_valid():
      return StreamingHttpResponse(create_model_generator(serializer.data['messages']), content_type='text/event-stream')
    else:
      return HttpResponse(f"Invalid input ${serializer.error_messages}", status=status.HTTP_400_BAD_REQUEST)

def create_model_generator(messages: Sequence[Message]) -> Generator[str, None, None]:
    client = Client(host=os.environ.get("OLLAMA_SERVER_URL"))
    response_stream = client.chat(model="model", messages=messages,stream=True)

    for chunk in response_stream:
      yield chunk['message']['content']