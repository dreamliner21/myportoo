const video = document.getElementById('profile-video');
const playButton = document.getElementById('play-btn');
const pauseButton = document.getElementById('pause-btn');
const videoContainer = document.querySelector('.video-container');

function playVideo() {
    video.play();
    videoContainer.classList.add('playing');  // Tambah kelas playing
    videoContainer.classList.remove('paused');
    playButton.classList.add('hidden');  // Sembunyikan tombol play
    pauseButton.classList.remove('hidden');  // Tampilkan tombol pause
}

function pauseVideo() {
    video.pause();
    videoContainer.classList.add('paused');  // Tambah kelas paused
    videoContainer.classList.remove('playing');
    playButton.classList.remove('hidden');  // Tampilkan tombol play
    pauseButton.classList.add('hidden');  // Sembunyikan tombol pause
}

// Form submit handler
document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });

    fetch('/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.ok) {
            Swal.fire(
                'Email Sent!',
                'Your message has been sent successfully.',
                'success'
            );
            this.reset(); // Reset form
        } else {
            Swal.fire(
                'Error!',
                'There was an error sending the email.',
                'error'
            );
        }
    });
});
