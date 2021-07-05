import { ChatAdapter, IChatGroupAdapter, User, Group, Message, ChatParticipantStatus, ParticipantResponse, ParticipantMetadata, ChatParticipantType, IChatParticipant } from 'ng-chat';
import { Observable, of } from 'rxjs';
import { delay } from "rxjs/operators";



export class DemoAdapter extends ChatAdapter implements IChatGroupAdapter {
  
  public static mockedParticipants: IChatParticipant[] = [
    {
      participantType: ChatParticipantType.User,
      id: 1,
      displayName: " Adjuster",
      avatar: "../insured/assets/danny.png",
      status: ChatParticipantStatus.Online,

    },
    ];

  listFriends(): Observable<ParticipantResponse[]> {
    return of(DemoAdapter.mockedParticipants.map(user => {
      let participantResponse = new ParticipantResponse();

      participantResponse.participant = user;
      participantResponse.metadata = {
   
      }

      return participantResponse;
    }));
  }

  getMessageHistory(destinataryId: any): Observable<Message[]> {
    let mockedHistory: Array<Message>;

    mockedHistory = [
      {
        fromId: 1,
        toId: 999,
        message: "Hi there, I'm your claims adjuster! Please let me know if you have any questions.",
        dateSent: new Date()
      }
    ];

    return of(mockedHistory).pipe(delay(2000));
  }
 


  sendMessage(message: Message): void {

    setTimeout(() => {
      let replyMessage = new Message();

      replyMessage.message = "You have typed '" + message.message + "'";
      replyMessage.dateSent = new Date();

      replyMessage.fromId = message.toId;
      replyMessage.toId = message.fromId;

        let user = DemoAdapter.mockedParticipants.find(x => x.id == replyMessage.fromId);

        
        
         this.onMessageReceived(user, replyMessage);
        //  DemoAdapter.mockedParticipants[0].totalUnreadMessages++;
     
    }, 1000);
  }

  groupCreated(group: Group): void {
    DemoAdapter.mockedParticipants.push(group);

    DemoAdapter.mockedParticipants = DemoAdapter.mockedParticipants.sort((first, second) =>
      second.displayName > first.displayName ? -1 : 1
    );

    // Trigger update of friends list
    this.listFriends().subscribe(response => {
       this.onFriendsListChanged(response);
    });
  }
}
