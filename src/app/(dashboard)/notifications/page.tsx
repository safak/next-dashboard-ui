"use client"
import { notificationsAPI } from "@/lib/api";
import { useState } from "react";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";

type Audience = "ALL" | "RESIDENT" | "TECHNICIAN"
export default function BroadcastNotification() {
    const [title, setTitle] = useState("")
    const [message, setMessage] = useState("")
    const [audience, setAudience] = useState("all")
    const [loading, setLoading] = useState(false)



    async function handleSend() {
    if (!title.trim() || !message.trim()){
      return alert("Fill in all fields");

    }

       // Validate title and message length
    if (title.length > 100) {
        return alert("Title must be 100 characters or less");
    }
    if (message.length > 500) {
        return alert("Message must be 500 characters or less");
    }
    setLoading(true);
    try {
      // POST to your API route
      await notificationsAPI.broadcast(title, message, audience);
      alert("Notification sent succesfully!");
      setTitle("")
        setMessage("")
          setAudience("ALL")
        
      
      // await fetch("/api/notifications", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ title, message, audience }),
      // });
      // alert("Notification sent!");
      // setTitle("");
      // setMessage("");
    } catch (err: any) {
      console.error("Failed to send notification", err);
      alert(err.message || "Failed to send notification:");
    } finally {
      setLoading(false);
    }
  }


  // return(
  //   <div>
  //       <h1 className="text-xl font-semibold mb-4">Broadcast Notification</h1>

  //       <label className="block mb-2 font-medium">Title</label>

  //       <input
  //       className="w-full p-2 mb-4 rounded border dark:bg-gray-800"
  //       value={title}
  //       onChange={(e) => setTitle(e.target.value)}
  //       placeholder="Enter Notification Title"
  //       />

  //       <label className="block font-medium mb-2">Message</label>
  //       <textarea
  //       className="w-full p-2 mb-4 rounded border dark:bg-gray-800"
  //       rows={4}
  //       value={message}
  //       onChange={(e) => setMessage(e.target.value)}
  //       placeholder="Write your message here"

  //       />
  //       <label className="block mb-2 font-medium">Audience</label>
  //       <select 
  //       className="w-full p-2 mb-4 rounded border dark:bg-gray-800" 
  //       value={audience}
  //       onChange={(e) => setAudience(e.target.value)}
  //       >
  //           <option value="all">All Users</option>
  //           <option value="resident">Resident Only</option>
  //           <option value="technicians">Technicians Only</option>

  //       </select>
  //       <button
  //       onClick={handleSend}
  //       disabled={loading}
  //       className="flex items-center gap-2 bg-blue-400 hover:bg-blue-700
  //                   text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
  //                   >
  //                   <FaPaperPlane/>
  //                   {loading ? "Sending..." : "Send Notification"}
  //       </button>
  //   </div>
  // )
  return(
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-xl font-semibold mb-4">Broadcast Notification</h1>

            <div className="space-y-4">
                <div>
                    <label className="block mb-2 font-medium text-gray-700">Title</label>
                    <span className="text-sm text-gray-500 ml-2">
                      {title.length} /100
                    </span>
                    <input
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter Notification Title"
                        disabled={loading}
                        maxLength={100}
                    />
                    {title.length >= 90 && (
                      <p className="text-sm text-orang-600 mt-1">Title is getting long ({title.length}/100)</p>
                    )}
                </div>

                <div>
                    <label className="block font-medium mb-2 text-gray-700">Message
                      <span className="text-sm text-gray-500 ml-2">
                        {message.length} /500
                      </span>
                  
                    </label>
                    <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your message here"
                        disabled={loading}
                        maxLength={500}
                    />
                    {message.length >= 450 && (
                      <p className="text-sm text-orange-600 mt-1">Message is getting long ({message.length}/500) </p>
                    )}
                </div>

                <div>
                    <label className="block mb-2 font-medium text-gray-700">Audience</label>
                    <select 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        value={audience}
                        onChange={(e) => setAudience(e.target.value as Audience)}
                        disabled={loading}
                    >
                        <option value="ALL">All Users</option>
                        <option value="RESIDENT">Residents Only</option>
                        <option value="TECHNICIAN">Technicians Only</option>
                    </select>
                </div>

                <button
                    onClick={handleSend}
                    disabled={loading || !title.trim() || !message.trim()}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700
                                text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed
                                transition-colors duration-200 w-full"
                >
                    {loading ? (
                        <>
                            <FaSpinner className="animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <FaPaperPlane/>
                            Send Notification
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}