import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { uid } from "uid";
import { toast } from "react-toastify";
import { set, ref, onValue, remove, update } from "firebase/database";

function Schedule() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [todo, setTodo] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  // load users from firebase

  const fetchUsers = () => {
    // try {
    onValue(ref(db, "users"), (snapshot) => {
      setUsers([]);
      const data = snapshot.val();
      console.log(data);
      if (data !== null) {
        Object.values(data).map((user) => {
          console.log(user);
          setUsers((oldArray) => [...oldArray, user]);
        });
      }
    });
  };

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

  const helperWrite = (uuid) => {
    set(ref(db, "meetings" + `/${uuid}`), {
      startTime,
      id: uuid,
      endTime,
      participants: selectedUsers,
    })
      .then(() => {
        setSelectedUsers([]);
        setStartTime("");
        setEndTime("");
        toast("Meeting Scheduled Successfully", { type: "success" });
        navigate("/");
      })
      .catch((error) => {
        toast("Something went wrong");
        console.log(error);
      });
  };

  const writeMeetingToDatabase = () => {
    const uuid = uid();
    helperWrite(uuid);
  };

  useEffect(() => {
    fetchUsers();
    fetchMeetings();
  }, []);

  const handleTodoChange = (e) => {
    setTodo(e.target.value);
  };

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
    if (selectedUsers.length < 2) {
      toast("participants less than 2", { type: "error" });
      return;
    }
    const start_time =
      parseInt(startTime.substring(0, 2)) * 60 +
      parseInt(startTime.substring(3, 5));
    const end_time =
      parseInt(endTime.substring(0, 2)) * 60 +
      parseInt(endTime.substring(3, 5));
    if (end_time - start_time < 10) {
      toast("Meeting length should be atleast 10 minutes", { type: "error" });
      return;
    }

    for (var meeting of meetings) {
      let start =
        parseInt(meeting.startTime.substring(0, 2)) * 60 +
        parseInt(meeting.startTime.substring(3, 5));
      let end =
        parseInt(meeting.endTime.substring(0, 2)) * 60 +
        parseInt(meeting.endTime.substring(3, 5));
      if (
        (start > start_time && start < end_time) ||
        (end > start_time && end < end_time)
      ) {
        for (var user of meeting.participants) {
          if (selectedUsers.includes(user)) {
            toast(
              `Interview timings of ${user} is clashed with current Interview`,
              { type: "error" }
            );
            return;
          }
        }
      }
    }

    writeMeetingToDatabase();
  };

  return (
    <>
      <div className="container-main">
        <h1>Schedule the Interview</h1>
        <div className="form-outline">
          <div className="form-wrapper">
            <div className="container-form">
              <h2 className="text-select-participants">Select participants</h2>
              <div className="users-div">
                {users &&
                  users.map((curUser) => (
                    <div key={curUser.id} className="input-div-users">
                      <input
                        className="text-input"
                        type="checkbox"
                        name={curUser.id}
                        id={curUser.id}
                        onClick={handleUserOnChange}
                      ></input>
                      <div for={curUser.id} className="text-label">
                        {curUser.name} {" ("} {curUser.id} {")"}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="input-div-time">
              <h2 className="text-select-time"> Select time slots</h2>
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
            submit details
          </button>
        </div>
        <button className="button" onClick={() => navigate("/")}>
          {" "}
          back{" "}
        </button>
      </div>
    </>
  );
}

export default Schedule;
