import { useCallback, useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';
import { Face } from '@/types';
import { useGetAllFaces, useSaveFaceDescriptors } from '@/lib/react-query/queriesAndMutations';

const FaceCam = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [detectedFace, setDetectedFace] = useState<Float32Array | null>(null);
  const [personName, setPersonName] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isFaceSaved, setIsFaceSaved] = useState(false);
  const [data, setData] = useState<Face[] | null>(null);

  const { data: ajaja, isLoading, isSuccess } = useGetAllFaces()
  const { mutateAsync: saveFaces } = useSaveFaceDescriptors()

  useEffect(() => {
    if (ajaja) {
      setData(ajaja)
    }

  }, [ajaja, isLoading, isSuccess])
  useEffect(() => {
    console.log(data, 'da')

  }, [data])

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error('Failed to load models', err);
      }
    };

    loadModels();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const initializeWebcam = async () => {
      if (modelsLoaded && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            streamRef.current = stream;
          }
        } catch (err) {
          console.error('Error accessing webcam: ', err);
        }
      }
    };

    initializeWebcam();
  }, [modelsLoaded]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (modelsLoaded && !isDetecting) {
        detectFace();
      }
    }, 500); // Detect face every 500

    return () => clearInterval(intervalId); // Clean up the interval on unmount
  }, [modelsLoaded, isDetecting]);

  const detectFace = useCallback(async () => {
    if (isDetecting) return; // Prevent re-entrancy
    setIsDetecting(true);

    const video = videoRef.current;
    if (video) {
      const detections = await faceapi.detectSingleFace(video)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detections?.descriptor) {
        setDetectedFace(detections.descriptor);
        checkFace(detections.descriptor);
      }

      if (detections) {
        console.log('Detections:', detections);
        // Rest of the logic
      } else {
        console.warn('No detections');
      }

    }

    setIsDetecting(false); // Reset detection state
  }, [detectedFace])

  const checkFace = async (descriptor: Float32Array) => {
    let bestMatch: string | null = null;
    let smallestDistance = Infinity;

    data?.forEach((face: Face) => {
      const savedDescriptor = new Float32Array(JSON.parse(face.descriptor as string));
      const distance = faceapi.euclideanDistance(descriptor, savedDescriptor);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        bestMatch = face.name;
      }
    });

    const THRESHOLD = 0.6;
    if (smallestDistance < THRESHOLD && bestMatch) {
      setPersonName(bestMatch);
      console.log(`Face recognized: ${bestMatch}`)

      // toast({ title: `Face recognized: ${bestMatch.name}` });
    } else {
      setPersonName(null);
      toast({ title: 'Face not recognized' });
    }
  };

  const handleSaveFace = async () => {
    if (detectedFace && !isFaceSaved) {
      await saveFaces(detectedFace);
      setIsFaceSaved(true);
      toast({ title: 'Face saved successfully!' });
    } else {
      toast({ title: 'No face detected to save.' });
    }
  };
  console.log('Models loaded:', modelsLoaded);
  if (videoRef.current && videoRef.current.readyState === 4) {
    const video = videoRef.current;
    // Proceed with detection
    console.log(video, 'video')
  } else {
    console.warn('Webcam not ready for detection');
  }


  return (
    <div>
      <h1>Face Recognition</h1>
      <><video ref={videoRef} autoPlay muted width={270} height={156} />

        <Button
          size="lg"
          className="p-5"
          onClick={handleSaveFace}
          disabled={isFaceSaved}
        >
          Save Face
        </Button>

        <Button size="lg" onClick={detectFace}>
          Scan Face Now
        </Button>
        {personName && <div><p>Recognized: {personName}</p></div>}
      </>
    </div>
  );
};

export default FaceCam;
