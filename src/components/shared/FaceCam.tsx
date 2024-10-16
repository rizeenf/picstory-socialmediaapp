import { useCallback, useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { Face } from "@/types";
import {
  useGetAllFaces,
  useSaveFaceDescriptors,
} from "@/lib/react-query/queriesAndMutations";
// import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
// import { Camera } from 'react-camera-pro'
import Webcam from "react-webcam";
// import Camera from "react-html5-camera-photo";


const FaceCam = () => {
  const videoRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // const videoRef2 = useRef<HTMLImageElement | null>(null);
  // const canvasRef2 = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [detectedFace, setDetectedFace] = useState<Float32Array | null>(null);
  const [personName, setPersonName] = useState<string>("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [isFaceSaved, setIsFaceSaved] = useState(false);
  const [facesData, setFacesData] = useState<Face[] | null>(null);
  const facesDataArr: string[] = [];

  const { data: faces, isLoading, isSuccess } = useGetAllFaces();
  const { mutateAsync: saveFaces } = useSaveFaceDescriptors();

  const lastAttendanceMap = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (faces) setFacesData(faces);
  }, [faces, isLoading, isSuccess]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.mtcnn.loadFromUri("/models"),
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error("Failed to load models", err);
      }
    };

    loadModels();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // useEffect(() => {
  //   const initializeWebcam = async () => {
  //     if (modelsLoaded && navigator.mediaDevices.getUserMedia) {
  //       try {
  //         const stream = await navigator.mediaDevices.getUserMedia({
  //           video: {},
  //         });
  //         if (videoRef.current) {
  //           videoRef.current.srcObject = stream;
  //           streamRef.current = stream;
  //         }
  //       } catch (err) {
  //         console.error("Error accessing webcam: ", err);
  //       }
  //     }
  //   };

  //   initializeWebcam();
  // }, [modelsLoaded]);

  useEffect(() => {
    const intervalId = setInterval(
      () => {
        if (modelsLoaded && !isDetecting) {
          detectFace();
        }
      },
      personName !== "" ? 1000 : 250
    ); // Detect face every 500

    return () => clearInterval(intervalId); // Clean up the interval on unmount
  }, [modelsLoaded, isDetecting]);

  const detectFace = useCallback(async () => {
    if (
      !videoRef.current ||
      !canvasRef.current ||
      isDetecting
      // ||
      // !videoRef2.current ||
      // !canvasRef2.current
    )
      return;

    setIsDetecting(true);

    const video = videoRef.current.video as any;
    // const video2 = videoRef2.current;
    const canvas = canvasRef.current;
    // const canvas2 = canvasRef2.current;

    if (video && canvas) {
      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      // const displaySize2 = { width: video2.width, height: video2.height };
      faceapi.matchDimensions(canvas, displaySize); // Match canvas to video size
      // faceapi.matchDimensions(canvas2, displaySize2); // Match canvas to video size

      const detections = await faceapi
        .detectSingleFace(video)
        .withFaceLandmarks()
        .withFaceDescriptor();

      // const detectionsManyFace = await faceapi
      //   .detectAllFaces(video2)
      //   .withFaceLandmarks()
      //   .withFaceDescriptors();

      // detectionsManyFace.forEach(async (detections) => {
      //   faceapi.matchDimensions(canvas2, displaySize2); // Match canvas to video size
      //   const resizedDetections2 = faceapi.resizeResults(
      //     detections,
      //     displaySize2
      //   );
      //   const { box } = resizedDetections2.detection;

      //   setDetectedFace(detections.descriptor);
      //   await checkFace(detections.descriptor);

      //   if (personName) {
      //     const textField = new faceapi.draw.DrawTextField(
      //       [personName],
      //       box.bottomLeft,
      //       { fontSize: 12 }
      //     );
      //     textField.draw(canvas2);
      //   } else {
      //     const textField = new faceapi.draw.DrawTextField(
      //       ["Tidak ditemukan"],
      //       box.bottomLeft,
      //       { fontSize: 12 }
      //     );
      //     textField.draw(canvas2);
      //   }
      // });

      if (detections) {
        // console.log('Detections:', detections);
        // console.log("Detections:", detectionsManyFace);

        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        setDetectedFace(detections.descriptor);
        await checkFace(detections.descriptor);

        // const resizedDetections2 = faceapi.resizeResults(
        //   detectionsManyFace,
        //   displaySize2
        // );
        // setDetectedFace(detections.descriptor);
        // await checkFace(detections.descriptor);

        const context = canvas.getContext("2d");
        context?.clearRect(0, 0, canvas.width, canvas.height);

        // const context2 = canvas2.getContext("2d");
        // context2?.clearRect(0, 0, canvas2.width, canvas2.height);

        faceapi.draw.drawDetections(canvas, resizedDetections);
        // faceapi.draw.drawDetections(canvas2, resizedDetections2);

        const { box } = resizedDetections.detection;
        if (personName) {
          const textField = new faceapi.draw.DrawTextField(
            [personName],
            box.bottomLeft,
            { fontSize: 12 }
          );
          textField.draw(canvas);
        } else {
          const textField = new faceapi.draw.DrawTextField(
            ["Tidak ditemukan"],
            box.bottomLeft,
            { fontSize: 12 }
          );
          textField.draw(canvas);
        }
      } else {
        console.warn("No detections");
      }
    }

    setIsDetecting(false); // Reset detection state
  }, [detectedFace]);

  const checkFace = async (descriptor: Float32Array) => {
    let bestMatch: string | null = null;
    let smallestDistance = Infinity;

    facesData?.forEach((face: Face) => {
      const savedDescriptor = new Float32Array(
        JSON.parse(face.descriptor as string)
      );
      const distance = faceapi.euclideanDistance(descriptor, savedDescriptor);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        bestMatch = face.name;
      }
    });

    const THRESHOLD = 0.5;
    if (smallestDistance < THRESHOLD && bestMatch) {
      setPersonName(bestMatch);
      console.log(`Face recognized: ${bestMatch}`);

      facesDataArr.push(bestMatch);
      // toast({ title: `Face recognized: ${bestMatch.name}` });
    } else {
      setPersonName("");
      // toast({ title: 'Face not recognized' });
    }
  };

  const handleSaveFace = async () => {
    if (detectedFace) {
      const lastAttendance = lastAttendanceMap.current.get(
        detectedFace.toString()
      );
      const currentTime = Date.now();

      if (lastAttendance && currentTime - lastAttendance < 10 * 60 * 1000) {
        // If last attendance was less than 10 minutes ago, skip saving
        console.log(
          `Skipping save for ${detectedFace}, attended within 10 minutes.`
        );
        toast({
          title: `${detectedFace} has already been marked within the last 10 minutes.`,
        });
        return;
      }

      // Update the last attendance time
      lastAttendanceMap.current.set(detectedFace.toString(), currentTime);
    }

    if (detectedFace && !isFaceSaved) {
      await saveFaces(detectedFace);
      setIsFaceSaved(true);
      toast({ title: "Face saved successfully!" });
    } else {
      toast({ title: "No face detected to save." });
    }
  };
  console.log("Models loaded:", modelsLoaded);
  if (videoRef.current && videoRef.current.readyState === 4) {
    const video = videoRef.current;
    // Proceed with detection
    console.log(video, "video");
  } else {
    console.warn("Webcam not ready for detection");
  }
  return (
    <div className="max-h-screen max-w-screen flex flex-col items-center">
      <h1>Face Recognition</h1>

      {personName && (
        <div>
          <p>Recognized: {personName}</p>
        </div>
      )}
      {facesDataArr && (
        <div>
          <p>Recognized: {facesDataArr}</p>
        </div>
      )}

      {/* Kamera dan Canvas untuk Face Recognition */}
      <div className="relative mb-5">

        <Webcam
          ref={videoRef}
          onPlay={detectFace}
          // width={240}
          // height={320}
          videoConstraints={{
            facingMode: "user",
            aspectRatio: 3 / 4,
            // width: 240,
            // height: 320
          }}
        />
        {/* <Camera
          ref={videoRef}
          errorMessages={{}}
          // onCameraStart={() => { detectFace }}
        /> */}

        {/* <video
          ref={videoRef}
          autoPlay
          muted
          width={320}
          height={240}
          className="relative z-[1]"
        /> */}
        <canvas
          ref={canvasRef}
          width={320}
          height={240}
          className="absolute top-0 left-0 z-[2]"
        />
      </div>

      {/* Image dan Canvas tambahan */}
      {/* <div className="relative mb-5">
        <img
          ref={videoRef2}
          width={50}
          height={50}
          style={{ position: "relative", zIndex: 1 }}
          src="/assets/ifca.jpeg"
        />
        <canvas
          ref={canvasRef2}
          width={50}
          height={50}
          className="absolute "
          style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }}
        />
      </div> */}

      {/* Button Section with Flexbox */}
      <div className="flex justify-center items-center mt-5 space-x-4 z-10">
        <Button
          size="lg"
          className={`p-5 text-lg rounded-lg ${isFaceSaved
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gray-900 hover:scale-105 active:scale-95 transition transform outline outline-dark-4 outline-1'
            } text-white`}  
          onClick={handleSaveFace}
          disabled={isFaceSaved}
        >
          Save Face
        </Button>

        <Button
          className="p-5 text-lg rounded-lg bg-gray-900 hover:scale-105 active:scale-95 transition transform text-white ml-4  outline outline-dark-4 outline-1"
          size="lg"
          onClick={detectFace}>
          Scan Face Now
        </Button>
      </div>
    </div>
  );
};

export default FaceCam;
