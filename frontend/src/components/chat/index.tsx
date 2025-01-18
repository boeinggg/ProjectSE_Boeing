import React, { useState, useEffect } from "react";
import "./chat.css";
import { CreateChat, GetChatsByAuctionId } from "../../services/https/chat";
import { ChatsInterface } from "../../interfaces/Chat";
import { useParams } from "react-router-dom";

interface ChatModalProps {
    onClose: () => void;
    auctionId: number; // auctionId passed from parent component
}

const ChatModal: React.FC<ChatModalProps> = ({ onClose, auctionId }) => {
    const { auctionDetailId } = useParams<{ auctionDetailId: string }>();
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<ChatsInterface[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch previous chat messages
    useEffect(() => {
        const fetchChatHistory = async () => {
            if (!auctionDetailId) return;

            try {
                setLoading(true);
                const response = await GetChatsByAuctionId(Number(auctionDetailId));
                setChatHistory(response.data);
            } catch (error) {
                console.error("Error fetching chat history:", error);
                setError("Failed to load chat history.");
            } finally {
                setLoading(false);
            }
        };

        fetchChatHistory();
    }, [auctionDetailId]);

    // Handle input change
    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    };

    // Handle send message
    const handleSendMessage = async () => {
        if (!message.trim()) return;
        // if (!sellerId || !bidderId) {
        //     setError("Missing user information.");
        //     return;
        // }

        const chatData: ChatsInterface = {
            Chat: message,
            SellerID: 1, // Use sellerId from props
            BidderID: 1, // Use bidderId from props
            AuctionDetailID: auctionId, // Use auctionId from props
        };

        try {
            setLoading(true);
            setError(null);
            const response = await CreateChat(chatData);

            console.log(response);

            if (response.status === 201) {
                setChatHistory([...chatHistory, response.data]);
                setMessage("");
            } else {
                setError("Failed to send message.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setError("An error occurred while sending the message.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-modal-overlay">
            <div className="chat-modal">
                <div className="modal-header">
                    <h2>Chat</h2>
                    <button className="close-button" onClick={onClose}>
                        X
                    </button>
                </div>
                <div className="modal-body">
                    {error && <p className="error-message">{error}</p>}
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            <div className="chat-messages">
                                {chatHistory.length > 0 ? (
                                    chatHistory.map((chat) => (
                                        <p key={chat.ID}>
                                            <strong>{chat.BidderID ? "Bidder" : "Seller"}: </strong>
                                            {chat.Chat}
                                        </p>
                                    ))
                                ) : (
                                    <p>No messages yet.</p>
                                )}
                            </div>
                            <textarea placeholder="Type a message..." value={message} onChange={handleMessageChange} />
                            <button onClick={handleSendMessage}>Send</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatModal;
