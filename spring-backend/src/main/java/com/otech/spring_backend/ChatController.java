package com.otech.spring_backend;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import reactor.core.publisher.Flux;

@RestController
public class ChatController {
    private final OllamaChatModel chatModel;

    @Autowired
    public ChatController(OllamaChatModel chatModel) {
        this.chatModel = chatModel;
    }

    @GetMapping("ai/generate")
    public Map generate(@RequestParam(value="message", defaultValue="Tell me a joke") String message) {
        return Map.of("generation", chatModel.call(message));
    }

    @GetMapping(value = "/ai/generateStream", produces = "application/stream+json")
    @CrossOrigin(origins = "http://localhost:4200")
    public Flux<ChatResponse> generateStream(@RequestParam(value="message", defaultValue="Tell me a joke") String message) {
        Prompt prompt = new Prompt(new UserMessage(message));
        return chatModel.stream(prompt);
    }

    @GetMapping(value = "/ai/generateStreamMock", produces = "application/stream+json")
    @CrossOrigin(origins = "http://localhost:4200")
    public Flux<ChatResponse> generateStreamMock(@RequestParam(value="message", defaultValue="Tell me a joke") String message) {

        Prompt prompt = new Prompt(new UserMessage(message));
        
        List<ChatResponse> responses = new ArrayList<>();

        for (int i = 0; i < 10; i++) {
            AssistantMessage assistantMessage = new AssistantMessage("Message + " + i);
            
            Generation generation = new Generation(assistantMessage);
            ChatResponse dummyResponse = new ChatResponse(List.of(generation));
            responses.add(dummyResponse);
        }

        return Flux.fromIterable(responses).delayElements(Duration.ofSeconds(1)).doOnNext(response -> System.out.println("Sending: " + response));
    }
}
