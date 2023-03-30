import { exec } from 'child_process';


const getAudio = async (link: string): Promise<void> => {
	if (!link) return;
	exec('"echo" "hi"', (err, stdout, stderr) => {
		if (err) throw err;
		console.log(stdout);
		console.log(stderr);
	});
}

exec('"./../binaries/yt-dlp.exe" "--help"', (err, stdout, stderr) => {
	if (err) throw err;
	console.log(stdout);
});