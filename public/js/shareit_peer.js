var downfiles = {};

socket.on('files.list', function(data)
{
	ui_updatefiles_peer(JSON.parse(data))

	info('files.list: '+Object.keys(JSON.parse(data)));
});

socket.on('transfer.send_chunk', function(file, chunk, data)
{
	f = downfiles[file];
	f.data = f.data + data;

	if(f.chunks == chunk)
		ui_filedownloaded(f);
	else
	{
		ui_filedownloading(f, chunk);

		// Demand more data
		socket.emit('transfer.query_chunk', file, parseInt(chunk)+1);
	}
});

function transfer_begin(file, fid, size)
{
	ui_transfer_begin(fid)

	var chunks = size/chunksize;
	if(chunks % 1 != 0)
		chunks = Math.floor(chunks) + 1;

	downfiles[file] = {data:'', chunk:0, chunks:chunks, fid:fid};

	// Demand data from the begining of the file
	socket.emit('transfer.query_chunk', file, 0);
}