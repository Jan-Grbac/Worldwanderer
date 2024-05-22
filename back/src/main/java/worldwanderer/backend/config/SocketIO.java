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
        String trip = data.split(":")[0];
        String user = data.split(":")[1];
        String operation = data.split(":")[2];
        System.out.println(user + " sent a message: " + data);
        for(SocketIOClient client : senderClient.getNamespace().getRoomOperations(trip).getClients()) {
            if(!client.getSessionId().equals(senderClient.getSessionId())) {
                switch(operation) {
                    case "TRIP_PARAMS_UPDATED":
                        client.sendEvent("TRIP_PARAMS_UPDATED", user);
                        break;
                    case "GRANTED_EDIT_PRIVILEGE":
                        String grantedUser = data.split(":")[3];
                        System.out.println(grantedUser + " was granted edit privileges on trip: " + trip);
                        client.sendEvent("GRANTED_EDIT_PRIVILEGE", grantedUser);
                        break;
                    case "REVOKED_EDIT_PRIVILEGE":
                        String revokedUser = data.split(":")[3];
                        System.out.println(revokedUser + "'s edit privileges on trip: " + trip + " were revoked");
                        client.sendEvent("REVOKED_EDIT_PRIVILEGE", revokedUser);
                        break;
                    case "ADDED_DATE_INTERVAL":
                        System.out.println(user + " added a new date interval.");
                        client.sendEvent("ADDED_DATE_INTERVAL", user);
                        break;
                    case "DELETED_DATE_INTERVAL":
                        System.out.println(user + " deleted a new date interval.");
                        client.sendEvent("DELETED_DATE_INTERVAL", user);
                        break;
                    case "UPDATED_DATE_INTERVAL":
                        client.sendEvent("UPDATED_DATE_INTERVAL", user);
                        break;
                    case "ADDED_TIMESLOT":
                        System.out.println(user + " added a new timeslot");
                        client.sendEvent("ADDED_TIMESLOT", user);
                        break;
                    case "DELETED_TIMESLOT":
                        System.out.println(user + " deleted a new timeslot");
                        client.sendEvent("DELETED_TIMESLOT", user);
                        break;
                    case "UPDATED_TIMESLOT":
                        System.out.println(user + " updated a timeslot");
                        client.sendEvent("UPDATED_TIMESLOT", user);
                        break;
                }
            }
        }
    };
}
