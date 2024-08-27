import { HttpClient, HttpClientModule, HttpEventType, HttpHeaders, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Component } from '@angular/core';
import { catchError, filter, map, throwError } from 'rxjs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { ChatResponse } from './ChatResponse';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [MatGridListModule,
     MatButtonModule,
      MatSidenavModule,
       MatListModule,
        MatCardModule,
         MatToolbarModule,
          MatAutocompleteModule,
           MatInputModule,
            MatFormFieldModule,
            ReactiveFormsModule],
  providers: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  response = "The component has loaded"
  showFiller: boolean = false
  private apiUrl = 'http://localhost:8084/ai/generateStreamMock'
  private message = "yup!"
  userInputControl = new FormControl('');

  responses: ChatResponse[] = [

  ]


  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  getChatResponse(message: string | null) {
    return this.http.get(`${this.apiUrl}?message=${message}`, {
      headers: new HttpHeaders({
        'Accept': 'application/stream+json'
      }),
      observe: 'body',
      responseType: 'text'
    }).pipe(
      map(responseText => {
        const jsonObjects = responseText.trim().split('\n').map(jsonString => JSON.parse(jsonString));
        return jsonObjects;
      }),
      catchError(error => {
        console.error('Parsing error:', error);
        return throwError(error);
      })
    );
  }

  sendToLLM() {
    this.getChatResponse(this.userInputControl.value).subscribe(response => {
      var res = this.mapLLMResponseToChatResponse(response)
      this.responses = res
    })
  }

  mapLLMResponseToChatResponse(llmResponse: any[]): ChatResponse[] {
    return llmResponse.map(responseObject =>  ({   
      author: responseObject.result.output.messageType,
      responseMessages: [responseObject.result.output.content],
      allowedRegeneration: false,
      allowedEdit: false
    }))
  }
}
