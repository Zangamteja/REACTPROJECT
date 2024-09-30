import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { set, ref, onValue, remove, update } from "firebase/database";

function UpdateInterview() {
  const location = useLocation();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [showUsers, setShowUsers] = useState(false);

  // load users from firebase

  const meetingId = location.state;

  const fetchMeeting = () => {
    onValue(ref(db, "meetings" + `/${meetingId}`), (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      if (data !== null) {
        setStartTime(data.startTime);
        setEndTime(data.endTime);
        setSelectedUsers(data.participants);
      }
    });
  };

  const fetchUsers = () => {
    // try {
    onValue(ref(db, "users"), (snapshot) => {
      setUsers([]);
      const data = snapshot.val();
      console.log(data);
      if (data !== null) {
        Object.values(data).map((user) => {
          console.log(user);
          let obj = { ...user, enable: false };
          if (selectedUsers.includes(user.id)) {
            obj.enable = true;
          }
          setUsers((oldArray) => [...oldArray, obj]);
        });
      }
    });
  };

  const helperWrite = () => {
    set(ref(db, "meetings" + `/${meetingId}`), {
      startTime,
      id: meetingId,
      endTime,
      participants: selectedUsers,
    })
      .then(() => {
        setSelectedUsers([]);
        setStartTime("");
        setEndTime("");
        toast("Meeting Updated Successfully", { type: "success" });
        navigate("/");
      })
      .catch((error) => {
        toast("Something went wrong");
        console.log(error);
      });
  };

  const writeMeetingToDatabase = () => {
    helperWrite();
  };

  useEffect(() => {
    fetchMeeting();
    fetchUsers();
  }, []);

  const handleUserOnChange = (e) => {
    const userId = e.target.id;
    console.log(selectedUsers);
    if (selectedUsers.includes(userId)) {
      const updatedUsers = selectedUsers.filter((user) => user.id !== userId);
      setSelectedUsers(updatedUsers);
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSubmit = () => {
    writeMeetingToDatabase();
  };

  return (
    <>
      <div className="container-main">
        <h1>Update the Interview Details</h1>
        <div className="form-outline">
          <div className="form-wrapper">
            <div className="input-div-time">
              <h2 className="text-select-time"> Update time slots</h2>
              <div className="inputs-container">
                <label> select Start time </label>
                <input
                  className=""
                  type="time"
                  min="00:00"
                  max="23:59"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="inputs-container">
                <label> select end time </label>
                <input
                  type="time"
                  min="00:00"
                  max="23:59"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>
          <button className="button" onClick={handleSubmit}>
            Update Interview
          </button>

          {/* <input
            style={{ margin: "50px" }}
            type="text"
            value={todo}
            onChange={handleTodoChange}
          />
          <button onClick={writeToDatabase}>submit</button> */}
        </div>
      </div>
    </>
  );
}

export default UpdateInterview;
