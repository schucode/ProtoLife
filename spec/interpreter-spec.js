describe("Interpreter", function () {

  beforeEach(function() {
      
    block1 = {
      state: 1
      north: block2
      neighbors: [block2, block3];
    };

    block2 = {
      state: 2
      east: block3
    };

    block3 = {
      state: 3
    };

    rules = [{conditions: ["state=1", 
                           "north/state=2",
                           "north.east/state=3",
                           "<2/neighbors/state=1"],

                outcomes: [moveForward]
    }]; 

  })

  describe("getOutcome", function () {
    it('returns the outcome array from a rule', function() {
      spyOn(getRule).and.returnValue(rules[0]);
      var result = getOutcome();
      var outcome = rules[0]["outcomes"];
      expect(result).toEqual([moveForward]);
    }); 
    
  });

 

});