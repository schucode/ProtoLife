var cycleControl = {
	state: {
		cycle: undefined,
		cycleNumber: 0,
		running: false
	},

	takeStep: function() {
		State.updateState();
		State.garbageControl();
		translateState(State);
	},

	start: function() {
		this.state.cycle = setInterval(this.takeStep, 150);
		this.state.running = true;
	},

	stop: function() {
		clearInterval(this.state.cycle);
		this.state.running = false;
	},
}