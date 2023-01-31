import { useState, useEffect, useRef } from "react";
import { Box } from "@mui/system";
import Header from "../../components/Header";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import RemainingTime from "./RemainingTime";
import Requirements from "./Requirements";
import { useSelector } from "react-redux";
import io from "socket.io-client";
let socket;

const Dashboard = () => {
  const user = useSelector((state) => state.user);
  const [show, setShow] = useState(false);
  const [examStatus, setES] = useState(null);
  const [requirements, setR] = useState({
    mic: false,
    camera: false,
    connection: false,
    speed: false,
  });

  useEffect(() => {
    socket = io.connect(process.env.REACT_APP_SERVER_URL);

    socket.emit("rejoin", user.id, async (data, err) => {
      console.log(data, err);
      if (data) {
        setES(data);
      }
    });
  }, []);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your Dashboard" />
      </Box>

      {user.type !== "admin" &&
        !Object.values(requirements).every((item) => item) &&
        !examStatus && <Requirements rq={requirements} srq={setR} />}

      {examStatus && (
        <>
          {examStatus?.canJoin ? (
            <div className="mt-5 text-center">
              <h3 className="mb-3 text-center">Exams are ongoing</h3>
              {examStatus?.rt > 0 && (
                <Button
                  variant="contained"
                  component="label"
                  size="small"
                  className="BTN"
                  size="large"
                  sx={{
                    boxShadow: 3,
                    pt: "10px",
                    pb: "10px",
                  }}
                  onClick={() => {
                    window.location.href = `/live-class?id=${examStatus.id}`;
                  }}
                >
                  <Typography variant="h3">Join Now</Typography>
                </Button>
              )}
            </div>
          ) : (
            <>
              <h3 className="mb-3 text-center">Exams are ongoing</h3>
              {examStatus?.delay && (
                <p className="mb-3 text-center">
                  You can join after delay ends
                </p>
              )}
              {examStatus?.break && (
                <p className="mb-3 text-center">
                  You can join after break ends
                </p>
              )}
            </>
          )}
        </>
      )}

      {Object.values(requirements).every((item) => item) && !examStatus && (
        <>{user.type !== "admin" && <RemainingTime />}</>
      )}
    </Box>
  );
};

export default Dashboard;
