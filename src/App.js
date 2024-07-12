import React, { useState, useEffect } from 'react';
import VideoPlayer from './components/VideoPlayer';
import Transcript from './components/Transcript';
import './App.css';

const App = () => {
    //Defining states with params
    const [captions1, setCaptions1] = useState([]);
    const [currentTime1, setCurrentTime1] = useState(0);
    const [captions2, setCaptions2] = useState([]);
    const [currentTime2, setCurrentTime2] = useState(0);
    const [selectedVideo, setSelectedVideo] = useState(1);

    const [captionFont, setCaptionFont] = useState('Arial');
    const [captionSize, setCaptionSize] = useState('20px');
    const [captionColor, setCaptionColor] = useState('#FFFFFF');

    //Fetch captions for videos
    useEffect(() => {
        fetch('/video_1/captions.srt')
            .then(response => response.text())
            .then(data => {
                const parsedCaptions = parseSRT(data);
                setCaptions1(parsedCaptions);
            });

        fetch('/video_2/captions.srt')
            .then(response => response.text())
            .then(data => {
                const parsedCaptions = parseSRT(data);
                setCaptions2(parsedCaptions);
            });
    }, []);

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
            i++;  //Skip empty line after the caption block

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

    //Handles clicking on a transcript line for video1
    const handleTranscriptClick1 = (time) => {
        const video = document.querySelector('#video1');
        video.currentTime = time;
    };

    //Handles clicking on a transcript line for video2
    const handleTranscriptClick2 = (time) => {
        const video = document.querySelector('#video2');
        video.currentTime = time;
    };

    //Handles video selection change
    const handleVideoSelect = (videoNumber) => {
        setSelectedVideo(videoNumber);
    };

    //Handles font change for captions
    const handleFontChange = (event) => {
        setCaptionFont(event.target.value);
    };

    //Handles font size change for captions
    const handleSizeChange = (event) => {
        setCaptionSize(event.target.value + 'px');
    };

    //Handles color change for captions
    const handleColorChange = (event) => {
        setCaptionColor(event.target.value);
    };

    //Rendering and returning videos with components VideoPlayer and Transcript with all functionality with captions, video switches(buttons) and options for changing captions font, font size and color 
    return (
        <div className="App">
            {selectedVideo === 1 && (
                <div className="video-section">
                    <VideoPlayer
                        videoId="video1"
                        videoSrc="/video_1/clip.mp4"
                        captions={captions1}
                        onTimeUpdate={setCurrentTime1}
                        captionStyle={{
                            fontFamily: captionFont,
                            fontSize: captionSize,
                            color: captionColor,
                        }}
                    />
                    <Transcript
                        captions={captions1}
                        onTranscriptClick={handleTranscriptClick1}
                        currentTime={currentTime1}
                    />
                </div>
            )}
            {selectedVideo === 2 && (
                <div className="video-section">
                    <VideoPlayer
                        videoId="video2"
                        videoSrc="/video_2/clip.mp4"
                        captions={captions2}
                        onTimeUpdate={setCurrentTime2}
                        captionStyle={{
                            fontFamily: captionFont,
                            fontSize: captionSize,
                            color: captionColor,
                        }}
                    />
                    <Transcript
                        captions={captions2}
                        onTranscriptClick={handleTranscriptClick2}
                        currentTime={currentTime2}
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
                            <select value={captionFont} onChange={handleFontChange}>
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
                                value={parseInt(captionSize, 10)}
                                onChange={handleSizeChange}
                                min="10"
                                max="50"
                            />
                        </label>
                        <label>
                            Color:
                            <input
                                type="color"
                                value={captionColor}
                                onChange={handleColorChange}
                            />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
