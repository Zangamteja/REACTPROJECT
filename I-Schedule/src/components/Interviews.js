import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { set, ref, onValue, remove, update } from "firebase/database";

function Interviews() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [participantsList, setParticipantsList] = useState([]);

  const fetchMeetings = () => {
    onValue(ref(db, "meetings"), (snapshot) => {
      setMeetings([]);
      const data = snapshot.val();
      console.log(data);
      if (data !== null) {
        Object.values(data).map((meeting) => {
          setMeetings((oldArray) => [...oldArray, meeting]);
        });
      }
    });
  };
  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleParticipants = (participants) => {
    handleClearPopup();
    var list = [];
    for (var participantId of participants) {
      onValue(ref(db, "users" + `/${participantId}`), (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
          console.log(data.name);
          list.push(data.name);
        }
      });
    }
    setTimeout(() => {
      console.log(list);
      setParticipantsList(list);
      setShowPopup(true);
    }, 1000);
  };

  const handleClearPopup = () => {
    setShowPopup(false);
    setParticipantsList([]);
  };

  const handleUpdate = (meetingId) => {
    navigate("/interview/update", { state: meetingId });
  };

  const handleDelete = (meetingId) => {
    remove(ref(db, "meetings" + `/${meetingId}`));
  };

  return (
    <div className="list-container-main">
      <h2>Scheduled Interviews</h2>
      <div className="list-div">
        {meetings &&
          meetings.map((meeting, index) => (
            <div key={index} className="meeting-div">
              <h2 className="text-interview">Interview {index + 1}</h2>
              <p className="text-time">
                <span className="label-time">start time: </span>{" "}
                {meeting.startTime} IST
              </p>
              <p className="text-time">
                <span className="label-time">end time: </span> {meeting.endTime}{" "}
                IST
              </p>
              <button
                className="button show-button"
                onClick={() => handleParticipants(meeting.participants)}
              >
                show participants
              </button>
              <br></br>
              <button
                className="button update-button"
                onClick={() => handleUpdate(meeting.id)}
              >
                update
              </button>
              <button
                className="button"
                onClick={() => handleDelete(meeting.id)}
              >
                delete
              </button>
            </div>
          ))}
      </div>
      {showPopup ? (
        <div className="pop-card">
          <div className="popup-wrapper">
            <h1>Participants</h1>
            <button className=" button close-button" onClick={handleClearPopup}>
              Close
            </button>
          </div>
          {participantsList &&
            participantsList.map((participant, index) => (
              <h2 key={index}>{participant}</h2>
            ))}
        </div>
      ) : (
        <></>
      )}
      <button className="button" onClick={() => navigate("/")}>
        {" "}
        back{" "}
      </button>
    </div>
  );
}

export default Interviews;
