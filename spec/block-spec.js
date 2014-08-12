describe("Block", function() {

	beforeEach(function() {

		/* 

		    (1, 1, 2)
		z   (1, 1, 1)(2, 1, 1)
		    (1, 1, 0)

						x
		*/

		State.addBlock(test_rules, 1, 1, 1);
		State.addBlock(test_rules, 1, 1, 2);
		State.addBlock(test_rules, 2, 1, 1);
		State.addBlock(test_rules, 1, 1, 0);

	})

	describe("north")

	

});