package worldwanderer.backend.config;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;

@Component
@CrossOrigin
public class SocketIO {

    private final SocketIOServer server;

    public SocketIO(SocketIOServer server) {
        this.server = server;

        server.addConnectListener(connectListener);
        server.addDisconnectListener(disconnectListener);
        server.addEventListener("UPDATE", String.class, updateListener);
    }

    private final ConnectListener connectListener = client -> {
        String trip = client.getHandshakeData().getSingleUrlParam("trip");
        client.joinRoom(trip);
        System.out.println(client.getSessionId().toString() + " joined the room " + trip);
        System.out.println("Clients in room " + client.getNamespace().getRoomOperations(trip).getClients());
    };

    private final DisconnectListener disconnectListener = client -> {
        System.out.println(client.getSessionId().toString() + " left the room.");
    };

    private final DataListener<String> updateListener = (senderClient, data, ackSender) -> {
        System.out.println(senderClient.getSessionId().toString() + " sent a message: " + data);
        for(SocketIOClient client : senderClient.getNamespace().getRoomOperations(data).getClients()) {
            if(!client.getSessionId().equals(senderClient.getSessionId())) {
                client.sendEvent("RENDER_UPDATE", data);
            }
        }
    };
}
