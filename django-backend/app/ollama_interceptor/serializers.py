from rest_framework import serializers
from .models import ChatMessage,ChatState

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['role', 'content']

class ChatStateSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True)

    class Meta:
        model = ChatState
        fields = ['user_id', 'messages']

    def create(self, validated_data):
        messages_data = validated_data.pop('messages')
        chat_state = ChatState.objects.create(**validated_data)
        for message_data in messages_data:
            ChatMessage.objects.create(chat_state=chat_state, **message_data)
        return chat_state
