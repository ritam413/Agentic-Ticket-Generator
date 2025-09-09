import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/tickets/${id}`,
          { method: "GET", credentials: "include" }
        );
        const data = await res.json();
        if (res.ok) {
          setTicket(data.ticket);
        } else {
          alert(data.message || "Failed to fetch ticket");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading ticket details...</div>;
  if (!ticket) return <div className="text-center mt-10">Ticket not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Ticket Details</h2>

      <div className="bg-gray-900 text-gray-100 rounded-xl shadow-md p-6 space-y-6">
        <h3 className="text-xl font-semibold">{ticket.title}</h3>
        <p className="whitespace-pre-line">{ticket.description}</p>

        <div className="border-t border-gray-700 pt-4 space-y-2">
          {ticket.status && <p><strong>Status:</strong> {ticket.status}</p>}
          {ticket.priority && <p><strong>Priority:</strong> {ticket.priority}</p>}
          {ticket.relatedSkills?.length > 0 && (
            <p><strong>Related Skills:</strong> {ticket.relatedSkills.join(", ")}</p>
          )}
        </div>

        {ticket.helpfulNotes?.length > 0 && (
          <div className="border-t border-gray-700 pt-4 space-y-4">
            <strong className="block mb-2">Helpful Notes:</strong>
            <div className="space-y-3">
              {ticket.helpfulNotes.map((note, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800 p-4 pl-6 rounded-lg shadow-sm whitespace-pre-line ml-2"
                >
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className="bg-gray-700 px-1 rounded">{children}</code>
                        );
                      },
                    }}
                  >
                    {note}
                  </ReactMarkdown>
                </div>
              ))}
            </div>
          </div>
        )}

        {ticket.resources?.length > 0 && (
          <div className="border-t border-gray-700 pt-4">
            <strong>Resources:</strong>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              {ticket.resources.map((res, idx) => (
                <li key={idx}>
                  <a
                    href={res}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {res}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {ticket.followUpQuestions?.length > 0 && (
          <div className="border-t border-gray-700 pt-4">
            <strong>Follow-up Questions:</strong>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              {ticket.followUpQuestions.map((q, idx) => (
                <li key={idx}>{q}</li>
              ))}
            </ul>
          </div>
        )}

        {ticket.assignedTo && <p><strong>Assigned To:</strong> {ticket.assignedTo?.email}</p>}
        {ticket.createdAt && (
          <p className="text-sm text-gray-500 mt-2">
            Created At: {new Date(ticket.createdAt).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
