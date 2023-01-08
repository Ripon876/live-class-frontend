import Roleplayer from "../Roleplayer";

function VideoContainer({ cvr, rvr, og, socket, clsId, rp }) {
	return (
		<>
			{rp && <Roleplayer socket={socket} cvr={cvr} clsId={clsId} />}
			<div className="video myVideo">
				<div>
					<video playsInline muted ref={cvr} autoPlay />
					<h2>You</h2>
				</div>
			</div>
			<div className="video otherVideo">
				<video playsInline ref={rvr} autoPlay />
				{!og && <h3 className="watingText">Joining</h3>}
			</div>
		</>
	);
}

export default VideoContainer;
