import React from 'react';
import '../App.css';

const Transcript = ({ captions = [], onTranscriptClick, currentTime }) => {
    //Formats the time in seconds to a string in the format hh:mm:ss to sync it with actual time on video
    const formatTime = (time) => {
        const date = new Date(0);
        date.setSeconds(time);
        return date.toISOString().substr(11, 8);
    };
    // Renders transcript compoment
    return (
        <div className="transcript-container">
            <h2>Transcript</h2>
            {captions.map((caption, index) => (
                <div
                    key={index}
                    className={`transcript-line ${currentTime >= caption.start && currentTime <= caption.end ? 'active' : ''}`}
                    onClick={() => onTranscriptClick(caption.start)}
                >
                    <strong>{formatTime(caption.start)}</strong> - {caption.text}
                </div>
            ))}
        </div>
    );
};

export default Transcript;
