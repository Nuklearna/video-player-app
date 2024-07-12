import React from 'react';
import '../App.css';

//Formats the time in seconds to a string in the format hh:mm:ss to sync it with actual time on video
const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${hours > 0 ? `${hours}:` : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const Transcript = ({ captions, onTranscriptClick, currentTime }) => {
    // Renders transcript compoment
    return (
        <div className="transcript-container">
            <h2>Transcript</h2>
            {captions.map((caption, index) => (
                <div
                    key={index}
                    className={`transcript-line ${currentTime >= caption.start && currentTime <= caption.end ? 'active' : ''}`}
                    onClick={() => onTranscriptClick(caption.start)} >
                    <span className="transcript-time">{formatTime(caption.start)}</span>
                    {caption.text}
                </div>
            ))}
        </div>
    );
};

export default Transcript;
