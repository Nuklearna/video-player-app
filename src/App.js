import React, { useState, useEffect } from 'react';
import VideoPlayer from './components/VideoPlayer';
import Transcript from './components/Transcript';
import './App.css';

const App = () => {
    
    const initialvalues = {
        font: "Arial",
        size: "20px",
        color: '#ffffff'
    };
      
    //Defining states
    const [captions, setCaptions] = useState([]); 
    const [currentTime, setCurrentTime] = useState(0);
    const [selectedVideo, setSelectedVideo] = useState(1);
    const [captionSettings, setCaptionSetings] = useState(initialvalues)

    //Fetch captions for videos
    useEffect(() => {
        const fetchCaptions = async () => {
            try {
                const response = await fetch(`/video_${selectedVideo}/captions.srt`);
                const data = await response.text();
                const parsedCaptions = parseSRT(data);
                setCaptions(parsedCaptions);
            } catch (error) {
                console.error('Error fetching captions:', error);
            }
        };

        fetchCaptions();
    }, [selectedVideo]);

    //Parses the SRT file content into an array of captions
    const parseSRT = (data) => {
        const captions = [];
        const lines = data.split('\n');
        let i = 0;

        while (i < lines.length) {
            const number = lines[i++].trim();
            if (!number) continue;

            const time = lines[i++].trim();
            const [start, end] = time.split(' --> ').map(parseTime);

            let text = '';
            while (i < lines.length && lines[i].trim()) {
                text += lines[i++].trim() + ' ';
            }
            i++;  // Skip empty line after the caption block

            captions.push({ start, end, text });
        }

        return captions;
    };

    //Parses the time string into seconds
    const parseTime = (time) => {
        const parts = time.split(':');
        const secondsParts = parts[2].split(',');
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        const seconds = parseInt(secondsParts[0], 10);
        const milliseconds = parseInt(secondsParts[1], 10);

        return (hours * 3600) + (minutes * 60) + seconds + (milliseconds / 1000);
    };

    //Handles clicking on a transcript line for videos
    const handleTranscriptClick = (time) => {
        const video = document.querySelector(`#video${selectedVideo}`);
        video.currentTime = time;
    };

   //Handles video selection change
     const handleVideoSelect = (videoNumber) => {
      setSelectedVideo(videoNumber);
    };

    //Handles caption style change
    const handleCaptionChange = (event) => {
        const { name, value } = event.target;
        setCaptionSetings(prevSettings => ({
            ...prevSettings,
            [name]: value
        }));
    };

    //Rendering and returning videos with components VideoPlayer and Transcript with all functionality with captions, video switches(buttons) and options for changing captions font, font size and color 
    return (
        <div className="App">
            {selectedVideo === 1 && (
                <div className="video-section">
                    <VideoPlayer
                            videoId={`video${selectedVideo}`}
                            videoSrc={`/video_${selectedVideo}/clip.mp4`}
                            captions={captions}
                            onTimeUpdate={setCurrentTime}
                            captionStyle={{
                                fontFamily: captionSettings.font,
                                fontSize: `${captionSettings.size}px`,
                                color: captionSettings.color
                            }}
                        />
                    <Transcript
                            captions={captions}
                            onTranscriptClick={handleTranscriptClick}
                            currentTime={currentTime}
                        />
                </div>
            )}
            {selectedVideo === 2 && (
                <div className="video-section">
                    <VideoPlayer
                            videoId={`video${selectedVideo}`}
                            videoSrc={`/video_${selectedVideo}/clip.mp4`}
                            captions={captions}
                            onTimeUpdate={setCurrentTime}
                            captionStyle={{
                                fontFamily: captionSettings.font,
                                fontSize: `${captionSettings.size}px`,
                                color: captionSettings.color
                            }}
                        />
                    <Transcript
                            captions={captions}
                            onTranscriptClick={handleTranscriptClick}
                            currentTime={currentTime}
                        />
                </div>
            )}
            <div className='select-caption-section'>
                <div className="select-video-buttons">
                    <button className='button-primary' onClick={() => handleVideoSelect(1)}>Video 1</button>
                    <button className='button-primary' onClick={() => handleVideoSelect(2)}>Video 2</button>
                </div>
                <div className="caption-style-controls">
                    <h2>Change caption style</h2>
                    <div className='caption-style-containter'>
                        <label>
                            Font:
                            <select name="font" value={captionSettings.font} onChange={handleCaptionChange}>
                                <option value="Arial">Arial</option>
                                <option value="Courier New">Courier New</option>
                                <option value="Georgia">Georgia</option>
                                <option value="Times New Roman">Times New Roman</option>
                                <option value="Verdana">Verdana</option>
                            </select>
                        </label>
                        <label>
                            Size in px:
                            <input
                                type="number"
                                name="size"
                                value={parseInt(captionSettings.size, 10)}
                                onChange={handleCaptionChange}
                                min="10"
                                max="50"
                            />
                        </label>
                        <label>
                            Color:
                            <input
                                type="color"
                                name="color"
                                value={captionSettings.color}
                                onChange={handleCaptionChange}
                            />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
