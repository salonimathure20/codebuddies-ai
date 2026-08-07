import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";

import axios from "axios";
import "styles/pages/session-screen.css";
import { Header } from "components/Header";
import { Navbar } from "components/Navbar";
import AvatarImg from "assets/avatar.png";
import {
  CallEndOutlined,
  MicNoneOutlined,
  RadioButtonCheckedOutlined,
  ScreenShareOutlined,
} from "@mui/icons-material";
import { useAuth } from "hooks/use-auth";
import { useLocation } from "react-router-dom";
import { fetchSessionById } from "services/session-service";
import { useDispatch } from "react-redux";
import { showSnackbar } from "store/snackbar-store";
const URL_WEB_SOCKET = "ws://10.10.40.105:8090/ws";

let localStream: MediaStream;
let localPeerConnection: RTCPeerConnection;

const SessionScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const location = useLocation();
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Write your code here");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [session, setSession] = useState<any>();

  console.log(uploadStatus);

  const { sessionId } = location.state || {};

  const [timeLeft, setTimeLeft] = useState(0); // Time left in seconds

  // Parse duration string into seconds
  const parseDuration = (duration: string) => {
    const value = duration.split(" ")[0];
    const time = parseInt(value, 10);

    return time * 60;
  };

  useEffect(() => {
    // Initialize the timer duration
    if (session) {
      setTimeLeft(parseDuration(session?.allottedTime));
    }
  }, [session?.allottedTime]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval on unmount
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchSession = async () => {
      const fetchedSession = await fetchSessionById(sessionId);
      setSession(fetchedSession);
    };

    fetchSession();
  }, []);

  const ws = useRef<WebSocket | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const saveCodeToFile = async () => {
    // Check if the File System Access API is available
    if (!("showSaveFilePicker" in window)) {
      alert("Your browser does not support the File System Access API.");
      return;
    }

    try {
      // Get the file extension based on the selected language
      const selectedLanguage = languageOptions.find(
        (opt) => opt.label === language
      );
      const fileExtension = selectedLanguage?.fileExtension || "txt";

      // Define MIME types for different file extensions
      const mimeTypes: any = {
        txt: "text/plain",
        js: "application/javascript",
        ts: "application/typescript",
        // Add other extensions and their MIME types here
      };

      const mimeType = mimeTypes[fileExtension] || "text/plain"; // Default to text/plain if not found

      // Ask the user where to save the file
      const fileHandle = await (window as any).showSaveFilePicker({
        suggestedName: `code.${fileExtension}`,
        types: [
          {
            description: `${language} file`,
            accept: {
              [mimeType]: [`.${fileExtension}`],
            },
          },
        ],
      });

      // Create a writable stream and write the content to the file
      const writableStream = await fileHandle.createWritable();
      await writableStream.write(code);
      await writableStream.close();

      alert("Code saved successfully!");
    } catch (err) {
      console.error("Error saving file:", err);
      alert("Failed to save the file.");
    }
  };

  const startRecording = async () => {
    try {
      // Request screen capture (without audio, you can add audio if needed)
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      // Create a MediaRecorder instance to record the stream
      const recorder = new MediaRecorder(screenStream, {
        mimeType: "video/webm",
      });

      // Collect data chunks as the video is being recorded
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      // When the recording is stopped, stop the screen stream
      recorder.onstop = () => {
        screenStream.getTracks().forEach((track) => track.stop());
      };

      // Start the recording
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      console.log("Recording started");
    } catch (err) {
      console.error("Error during screen capture: ", err);
    }
  };

  const uploadVideoToS3 = async () => {
    if (recordedChunks.length > 0) {
      try {
        // Combine recorded chunks into a single Blob
        const videoBlob = new Blob(recordedChunks, { type: "video/mp4" });

        // Call your pre-signed URL API
        const response = await axios.post("http://localhost:3001/api/s3", {
          userId: user?.id,
          sessionId: sessionId,
          filename: `screen-recording.mp4`,
          contentType: "video/mp4",
        });

        const presignedUrl = response.data.result.signedUrl;

        // Upload the video blob to S3 using the pre-signed URL
        const uploadResponse = await axios.put(presignedUrl, videoBlob, {
          headers: {
            "Content-Type": "video/mp4",
          },
        });

        if (uploadResponse.status === 200) {
          console.log("Video successfully uploaded to S3");
          setUploadStatus("Upload successful!");
        } else {
          console.error("Failed to upload video to S3");
          setUploadStatus("Upload failed.");
        }

        dispatch(showSnackbar({ message: "Video Saved", severity: "success" }));
      } catch (error) {
        console.error("Error uploading video:", error);
        setUploadStatus("Upload failed.");
      } finally {
        // Clear recorded chunks after upload
        setRecordedChunks([]);
      }
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
      console.log("Recording stopped");
      uploadVideoToS3();
    }
  };

  // Helper to extract query parameters
  const getQueryParam = (param: string): string | null => {
    return new URLSearchParams(window.location.search).get(param);
  };

  useEffect(() => {
    const wsClient = new WebSocket(URL_WEB_SOCKET);

    wsClient.onopen = () => {
      console.log("WebSocket opened");
      ws.current = wsClient;
      setupDevice();
    };

    wsClient.onclose = () => console.log("WebSocket closed");

    wsClient.onmessage = (message: MessageEvent) => {
      const parsedMessage = JSON.parse(message.data);
      const { type, body } = parsedMessage;

      switch (type) {
        case "joined":
          console.log("Users in this channel", body);
          break;
        case "offer_sdp_received":
          onAnswer(body);
          break;
        case "answer_sdp_received":
          gotRemoteDescription(body);
          break;
        case "ice_candidate_received":
          // Handle ICE candidate if needed
          break;
        case "code_update":
          setCode(body.code); // Update the code in the editor
          break;
        default:
          console.warn("Unknown message type:", type);
      }
    };

    return () => {
      wsClient.close();
    };
  }, []);

  const gotRemoteDescription = (answer: RTCSessionDescriptionInit) => {
    localPeerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    localPeerConnection.ontrack = gotRemoteStream;
  };

  const onAnswer = (offer: RTCSessionDescriptionInit) => {
    console.log("onAnswer invoked");
    localPeerConnection = new RTCPeerConnection(pcConstraints);
    localPeerConnection.onicecandidate = gotLocalIceCandidateAnswer;
    localPeerConnection.ontrack = gotRemoteStream;
    localStream
      .getTracks()
      .forEach((track) => localPeerConnection.addTrack(track, localStream));
    localPeerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    localPeerConnection.createAnswer().then(gotAnswerDescription);
  };

  const gotAnswerDescription = (answer: RTCSessionDescriptionInit) => {
    localPeerConnection.setLocalDescription(answer);
  };

  const gotLocalIceCandidateAnswer = (event: RTCPeerConnectionIceEvent) => {
    if (!event.candidate && ws.current) {
      const answer = localPeerConnection.localDescription;
      sendWsMessage("send_answer", {
        channelName: getQueryParam("channelName"),
        userName: getQueryParam("userName"),
        sdp: answer,
      });
    }
  };

  const sendWsMessage = (type: string, body: unknown) => {
    ws.current?.send(JSON.stringify({ type, body }));
  };

  const pcConstraints: RTCConfiguration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const setupPeerConnection = () => {
    console.log("Setting up peer connection");
    localPeerConnection = new RTCPeerConnection(pcConstraints);
    localPeerConnection.onicecandidate = gotLocalIceCandidateOffer;
    localPeerConnection.ontrack = gotRemoteStream;
    localStream
      .getTracks()
      .forEach((track) => localPeerConnection.addTrack(track, localStream));
    localPeerConnection.createOffer().then(gotLocalDescription);
  };

  const gotLocalDescription = (offer: RTCSessionDescriptionInit) => {
    localPeerConnection.setLocalDescription(offer);
  };

  const gotRemoteStream = (event: RTCTrackEvent) => {
    const remotePlayer = document.getElementById(
      "peerPlayer"
    ) as HTMLVideoElement;
    if (remotePlayer) remotePlayer.srcObject = event.streams[0];
  };

  const gotLocalIceCandidateOffer = (event: RTCPeerConnectionIceEvent) => {
    if (!event.candidate && ws.current) {
      const offer = localPeerConnection.localDescription;
      sendWsMessage("send_offer", {
        channelName: getQueryParam("channelName"),
        userName: getQueryParam("userName"),
        sdp: offer,
      });
    }
  };

  const setupDevice = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        const localPlayer = document.getElementById(
          "localPlayer"
        ) as HTMLVideoElement;
        if (localPlayer) localPlayer.srcObject = stream;
        localStream = stream;
        ws.current?.send(
          JSON.stringify({
            type: "join",
            body: {
              channelName: getQueryParam("channelName"),
              userName: getQueryParam("userName"),
            },
          })
        );
        setupPeerConnection();
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
      });
  };

  const languageOptions = [
    { label: "Python", name: "python", version: "3.9.7", fileExtension: "py" },
    {
      label: "JavaScript",
      name: "javascript",
      version: "*",
      fileExtension: "js",
    },
    { label: "Java", name: "java", version: "15.0.2", fileExtension: "java" },
  ];

  const executeCode = async () => {
    const selectedLanguage = languageOptions.find(
      (opt) => opt.label === language
    );
    if (!selectedLanguage) return;

    const languageName = selectedLanguage.name; // e.g., "python", "javascript"
    const version = selectedLanguage.version || "*"; // Use "*" for latest version
    setLoading(true);
    setOutput("");

    try {
      const payload = {
        language: languageName,
        version, // e.g., "3.9.7" for Python or "*" for latest
        files: [
          {
            name: "main." + selectedLanguage.fileExtension, // e.g., "main.py" for Python
            content: code, // The code to execute
          },
        ],
        stdin: "", // Optional: Input for the program
      };

      const response = await axios.post(
        "https://emkc.org/api/v2/piston/execute",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data;
      setOutput(result.run.stdout || result.run.stderr || "No output");
    } catch (error) {
      console.error("Error executing code:", error);
      setOutput("Error executing code.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditorChange = (newCode: string | undefined) => {
    if (newCode && ws.current) {
      console.log("Sending code update:", newCode); // Debugging
      ws.current.send(
        JSON.stringify({
          type: "code_update",
          body: {
            channelName: getQueryParam("channelName"),
            userName: getQueryParam("userName"),
            code: newCode,
          },
        })
      );
    }
  };

  if (isRecording) {
    document.body.style.border = "5px solid #399bc4";
  } else {
    document.body.style.border = "none";
  }

  return (
    <>
      <Header
        headerLabel={"Session in progress"}
        showButton={true}
        buttonLabel="Go Live"
        buttonClick={() => {}}
      />
      <Navbar avatarImgSrc={AvatarImg} />
      <div className="session-container">
        {/* Code Editor and Cameras */}
        <div className="main-section">
          {/* Code Editor */}
          <div className="code-editor-section">
            <div className="editor-toolbar">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="language-select"
              >
                {languageOptions.map((opt) => (
                  <option value={opt.label}>{opt.label}</option>
                ))}
              </select>
              <button
                onClick={executeCode}
                className="run-button"
                disabled={loading}
              >
                {loading ? "Running..." : "Run"}
              </button>
            </div>
            <div className="editor-run">
              <Editor
                height="100%"
                width="50%"
                defaultLanguage={language}
                value={code}
                theme="vs-dark"
                onChange={async (value) => {
                  setCode(value || "");
                  handleEditorChange(value);
                }}
              />
              <div className="output-container">
                <h3>Output:</h3>
                <pre>{output}</pre>
              </div>
            </div>
          </div>

          {/* Cameras */}
          <div className="camera-section">
            <div className="camera-window">
              <video
                id="peerPlayer"
                autoPlay
                muted
                style={{ width: "100%", height: "100%", zIndex: 1 }}
              ></video>
              <p
                style={{
                  zIndex: 2,
                  position: "absolute",
                }}
              >
                {session?.coderId?.name!}
              </p>
            </div>

            <div className="camera-window">
              <video
                id="localPlayer"
                autoPlay
                muted
                style={{ width: "100%", height: "100%", zIndex: 1 }}
              />{" "}
              <p
                style={{
                  zIndex: 2,
                  position: "absolute",
                }}
              >
                {session?.proctorId?.name!}
              </p>
            </div>

            <div className="remaining-time">
              <p style={{ margin: 0 }}>Time Left: {formatTime(timeLeft)}</p>
            </div>
          </div>
        </div>

        {/* Output Section */}

        {/* Bottom Buttons */}
        <div className="button-bar">
          <div className="circle-button blue-button" onClick={stopRecording}>
            <MicNoneOutlined />
          </div>
          <div className="circle-button yellow-button" onClick={saveCodeToFile}>
            <ScreenShareOutlined />
          </div>
          <div className="circle-button red-button">
            <CallEndOutlined />
          </div>
          <div
            className="circle-button green-button"
            onClick={() => {
              if (isRecording) {
                stopRecording();
              } else {
                startRecording();
              }
            }}
          >
            <RadioButtonCheckedOutlined
              color={isRecording ? "error" : "success"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SessionScreen;
