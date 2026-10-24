/* 音乐：只有“已下载”的歌能放；其他显示云朵图标，点了提示未下载。
 * 歌曲文件放 assets/music/，src 留空就是未下载。Butterfly 单曲循环。 */
window.STORY = window.STORY || {};
window.STORY.music = {
  playlist: '南俊的歌',
  tracks: [
    { id: 'butterfly', title: 'Butterfly (demo)', artist: '防弹少年团', album: '', time: '4:55', src: 'assets/music/butterfly.m4a', coverImg: 'assets/music/butterfly-cover.jpg' },
    { id: 'fly', title: 'Fly', artist: 'Epik High', album: 'Swan Songs', time: '', src: '' },
    { id: 'lose', title: 'Lose Yourself', artist: 'Eminem', album: '8 Mile', time: '5:26', src: '' },
    { id: 'nysom', title: 'N.Y. State of Mind', artist: 'Nas', album: 'Illmatic', time: '4:54', src: '' },
    { id: 'raplegend', title: 'Rap Genius', artist: 'San E', album: '', time: '', src: '' },
    { id: 'changes', title: 'Changes', artist: '2Pac', album: 'Greatest Hits', time: '4:29', src: '' }
  ]
};
