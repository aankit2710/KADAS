<template>
  <div>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>START CONVERSATION</v-card-title>
        <v-card-text>
          <v-select :items="options" v-model="selectedUserType" label="user type"></v-select>
          <v-select
            :items="selectedUserType=='learner'?learner_users:educator_users"
            @change="userSelected"
            v-model="query"
            item-text="full_name"
            return-object
          ></v-select>
          <ul class="list-group p-0 pt-2">
            <li
              v-for="(participant,idx) in participantsForNewConversation"
              class="list-group-item"
              v-bind:key="participant"
              ref="selectedUserDropdown"
            >
              {{participant.full_name}}
              <v-btn
                class="btn btn-danger float-right"
                color="red"
                dark
                @click="removeParticipantFromModal(idx)"
              >
                Remove
                <v-icon dark right>mdi-cancel</v-icon>
              </v-btn>
            </li>
          </ul>
          <div class="form-group" v-if="participantsForNewConversation.length>=1">
            <v-text-field
              id="roomName"
              class="input"
              v-model="roomNameInput"
              placeholder="Chat Name"
            />
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="createANewConversation"
            :disabled="participantsForNewConversation.length<1 && roomNameInput===''"
          >Create</v-btn>
          <v-btn color="#4ebc2a" @click="dialog = false">CLOSE</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <chat-window
      height="calc(100vh - 50px)"
      :currentUserId="currentUserId"
      :rooms="rooms"
      :messages="selectedRoomMessages"
      :roomId="selectedRoom"
      @addRoom="addRoom"
      @fetchMessages="fetchMessages"
      :messagesLoaded="messagesLoaded"
      @sendMessage="sendMessage"
      :loadingRooms="isRoomLoading"
      :newMessages="[]"
      @openFile="openFile"
      :messageActions="messageActions"
      @messageActionHandler="messageActionHandler"
      :menuActions="menuActions"
      @menuActionHandler="menuActionHandler"
    />
  </div>
</template>
<script>
import ChatWindow from "vue-advanced-chat";
import "vue-advanced-chat/dist/vue-advanced-chat.css";
// import VueBootstrapTypeahead from "vue-bootstrap-typeahead";
// import "vue-bootstrap-typeahead/dist/VueBootstrapTypeahead.css";
// import "bootstrap/dist/css/bootstrap.css";

const axios = require("axios").default;

export default {
  components: {
    ChatWindow,
    // VueBootstrapTypeahead,
  },
  data() {
    return {
      isRoomLoading: false,
      rooms: [],
      currentUserId: this.$store.state.sessionData[1].user.id,
      currentUserToken: this.$store.state.sessionData[0].token,
      addNewRoom: false,
      dialog: false,
      query: "meow",
      users: [],
      selectedRoom: null,
      selectedRoomMessages: [],
      start: null,
      end: null,
      messagesLoaded: true,
      participantsForNewConversation: [],
      roomNameInput: "",
      messageActions: [],
      menuActions: [],
      options: ["learner", "educator"],

      selectedUserType: "learner",
      learner_users: [],
      educator_users: [],
      messageActionsNormal: [
        { name: "favouriteMessage", title: "Add to favourites" },
      ],
      messageActionsFavMode: [
        {
          name: "unfavouriteMessage",
          title: "Remove from favourites",
        },
      ],
      menuActionsNormal: [{ name: "showFav", title: "Show Favorites" }],
      menuActionsFavMode: [{ name: "exitFav", title: "Exit Favorites" }],
    };
  },
  methods: {
    addRoom() {
      this.dialog = true;
    },
    userSelected() {
      console.log("SELECTED", this.query);
      for (let participant of this.participantsForNewConversation) {
        console.log(participant);
        if (participant.id === this.query.id) {
          this.query = -1;
          return;
        }
      }
      this.participantsForNewConversation.push(this.query);
      this.query = -1;
      // this.$refs.selectedUserDropdown.reset();
    },
    getAllTheUsers() {
      axios
        .get("https://school.kfundi.com/api/users", {
          headers: { Authorization: "Bearer " + this.currentUserToken },
        })
        .then((res) => {
          // console.log(res.data.data);
          const users_resp = res.data.data;
          this.users = users_resp.filter(
            (user) => user.id != this.currentUserId
          );

          this.educator_users = this.users.filter((x) => x.employee != null);
          this.learner_users = this.users.filter((x) => x.employee == null);
        });
    },
    fetchMessages({ room, options = {} }) {
      options;
      this.messageActions = this.messageActionsNormal;
      this.menuActions = this.menuActionsNormal;
      this.reset();
      this.messagesLoaded = false;
      this.selectedRoom = room.roomId;
      axios
        .get(
          "https://school.kfundi.com/api/chat/conversations/" +
            room.roomId +
            "/messages",
          { headers: { Authorization: "Bearer " + this.currentUserToken } }
        )
        .then((res) => {
          let listOfMessages = res.data.data;
          this.selectedRoomMessages = listOfMessages.map(this.formatMessages);
          this.messagesLoaded = true;
        });
    },
    formatMessages(messageResponse) {
      let message = {
        _id: "id" in messageResponse ? messageResponse.id : "",
        sender_id: messageResponse.sender.id,
        // disable_actions: true,
        disable_reactions: true,
        seen: messageResponse.sender.id != this.currentUserId ? true : false,
      };
      if (messageResponse.type == "text") {
        message.content = messageResponse.body;
      } else {
        message.content = "FILE";
        message.file = {
          name: "FILE",
          url: messageResponse.body,
          type: messageResponse.type,
        };
      }
      let d = new Date(messageResponse.created_at);
      message.date = d.toDateString();
      message.timestamp = d.toLocaleTimeString();
      return message;
    },
    reset() {
      this.selectedRoomMessages.splice(0, this.selectedRoomMessages.length);
    },
    removeParticipantFromModal(idx) {
      this.participantsForNewConversation.splice(idx, 1);
      this.query = 0;
    },
    createANewConversation() {
      axios
        .post(
          "https://school.kfundi.com/api/chat/conversations",
          {
            name: this.roomNameInput,
            participants: this.participantsForNewConversation.map((x) => x.id),
          },
          { headers: { Authorization: "Bearer " + this.currentUserToken } }
        )
        .then(() => {
          alert("Conversation " + this.roomNameInput + " created");
          this.dialog = false;
          this.initializeRooms();
        })
        .catch(() => {
          alert("conversation could not be created");
          this.dialog = false;
        });
    },
    initializeRooms() {
      this.messageActions = this.messageActionsNormal;
      this.menuActions = this.menuActionsNormal;
      console.log("called intialize");
      this.isRoomLoading = true;
      this.rooms.splice(0, this.rooms.length);
      this.fetchAllConversationForLoggedUser().then((listOfConvo) => {
        listOfConvo.forEach((convo) => {
          let formattedRoom = this.formatConversationToRooms(convo);
          this.rooms.push(formattedRoom);
        });
        this.selectedRoom = listOfConvo[0].id;
        this.isRoomLoading = false;
      });
    },
    formatConversationToRooms(convo) {
      let room = {
        roomId: convo.id,
        roomName: convo.name,
        lastMessage: convo.last_message
          ? this.formatMessages(convo.last_message)
          : convo.last_message, //needs a logic
        users: [],
        avatar: convo.image,
      };
      convo.participants.forEach((x) => {
        room.users.push({
          _id: x.id,
          username: x.first_name + " " + x.last_name,
        });
      });
      return room;
    },
    async fetchAllConversationForLoggedUser() {
      let response = await axios.get(
        "https://school.kfundi.com/api/chat/conversations",
        { headers: { Authorization: "Bearer " + this.currentUserToken } }
      );
      let listOfConvo = response.data.data;
      return listOfConvo;
    },
    sendMessage({ content, roomId, file, replyMessage }) {
      console.log("trying to send", content, file);
      replyMessage;
      let formData = new FormData();
      if (file) {
        console.log(file);
        formData.set("type", "file");
        formData.set("body", file.blob);
        this.submitAMessage(roomId, formData);
      } else {
        formData.set("type", "text");
        formData.set("body", content);
        this.submitAMessage(roomId, formData);
      }
    },
    submitAMessage(roomId, formData) {
      axios
        .post(
          "https://school.kfundi.com/api/chat/conversations/" +
            roomId +
            "/messages",
          formData,
          {
            headers: {
              Authorization: "Bearer " + this.currentUserToken,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then(() => {
          this.fetchMessages({ room: { roomId: roomId }, reset: true });
        })
        .catch(() => {
          alert("something went wrong");
        });
    },
    openFile(message) {
      console.log(message);
      window.open(message.file.url, "_blank");
    },
    messageActionHandler({ roomId, action, message }) {
      // console.log(roomId, action, message);
      if (action.name === "unfavouriteMessage") {
        axios
          .post(
            "https://school.kfundi.com/api/chat/conversations/" +
              roomId +
              "/messages/" +
              message._id +
              "/unpin",
            new FormData(),
            {
              headers: {
                Authorization: "Bearer " + this.currentUserToken,
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then(() => this.showFavourites(roomId))
          .catch(() => alert("Pinning Failed"));
      } else {
        axios
          .post(
            "https://school.kfundi.com/api/chat/conversations/" +
              roomId +
              "/messages/" +
              message._id +
              "/pin",
            new FormData(),
            {
              headers: {
                Authorization: "Bearer " + this.currentUserToken,
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then()
          .catch(() => alert("Pinning Failed"));
      }
    },
    menuActionHandler({ roomId, action }) {
      if (action.name === "showFav") this.showFavourites(roomId);
      else this.exitFav(roomId);
    },
    showFavourites(roomId) {
      this.messagesLoaded = false;
      this.selectedRoomMessages = [];
      this.menuActions = this.menuActionsFavMode;
      this.messageActions = this.messageActionsFavMode;
      axios
        .get("https://school.kfundi.com/api/chat/conversations/" + roomId, {
          headers: { Authorization: "Bearer " + this.currentUserToken },
        })
        .then((res) => {
          let pinnedMessages = res.data.data.pinned_messages;
          console.log(pinnedMessages);
          this.selectedRoomMessages = pinnedMessages.map(this.formatMessages);
          this.messagesLoaded = true;
        });
    },
    exitFav(roomId) {
      this.fetchMessages({ room: { roomId: roomId }, reset: true });
    },
  },
  mounted() {
    this.getAllTheUsers();
    this.initializeRooms();
    // console.log(this.messageActions);
  },
};
</script>
