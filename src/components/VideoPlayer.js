import React, { useRef, useEffect, useState } from 'react';
import '../App.css';

const VideoPlayer = ({ videoSrc, captions, onTimeUpdate, videoId, captionStyle }) => {
    const videoRef = useRef(null);
    const [currentCaption, setCurrentCaption] = useState('');

    /**
     * Handles the time update event of the video.
     * Finds the active caption based on the current time and updates the current caption state (transcript).
    */
    useEffect(() => {
        const video = videoRef.current;
        
        const handleTimeUpdate = () => {
            const currentTime = video.currentTime;
            const activeCaption = captions.find(
                caption => currentTime >= caption.start && currentTime <= caption.end
            );

            if (activeCaption) {
                setCurrentCaption(activeCaption.text);
            } else {
                setCurrentCaption('');
            }

            if (onTimeUpdate) {
                onTimeUpdate(currentTime);
            }
        };

        video.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [captions, onTimeUpdate]);

    // Renders video with captions compoment
    return (
        <div className="video-container">
            <video id={videoId} ref={videoRef} controls>
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="caption-container" style={captionStyle}>{currentCaption}</div>
        </div>
    );
};

export default VideoPlayer;
