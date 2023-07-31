package ws

type Room struct {
	ID      string             `json:"id"`
	Name    string             `json:"name"`
	Clients map[string]*Client `json:"client"`
}
type Hub struct {
	Rooms      map[string]*Room
	Register   chan *Client
	Unregister chan *Client
	BroadCast  chan *Message
}

func NewHub() *Hub {
	return &Hub{
		Rooms:      make(map[string]*Room),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		BroadCast:  make(chan *Message, 5),
	}
}
func (h *Hub) Run() {
	for {
		select {
		case cl := <-h.Register:
			if _, ok := h.Rooms[cl.RoomID]; ok {
				r := h.Rooms[cl.RoomID]
				if _, ok := r.Clients[cl.ID]; !ok {
					r.Clients[cl.ID] = cl
				}
			}
		case cl := <-h.Unregister:
			if _, ok := h.Rooms[cl.RoomID]; ok {
				if _, ok := h.Rooms[cl.RoomID].Clients[cl.ID]; ok {
					// Broadcast a message saying that the client has left the room

					if len(h.Rooms[cl.RoomID].Clients) != 0 {
						h.BroadCast <- &Message{
							Content:  "User Left The Chat",
							RoomID:   cl.RoomID,
							Username: cl.Username,
						}
					}

					delete(h.Rooms[cl.RoomID].Clients, cl.ID)
					close(cl.Message)
				}
			}

		case m := <-h.BroadCast:
			if _, ok := h.Rooms[m.RoomID]; ok {
				for _, cl := range h.Rooms[m.RoomID].Clients {
					cl.Message <- m
				}
			}
		}
	}
}
