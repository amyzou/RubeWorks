

function ControllerTest(){
	// CONTROLLER TESTING THINGS -------------------------------------------
	console.log("CONTROLLER TESTING ------------------------------------------");	

	var sphereID = 4; var arrowID = 5; var blockID = 1; var dominoID = 2; var rampID = 3;

	// Chaining test 1. Sphere rolls across blocks, down ramp, falls down.
	// Add blocks.
	controller.AddObject(blockID, 0, [1,0,5], 0);
	controller.AddObject(blockID, 1, [2,0,5], 0);
	controller.AddObject(blockID, 2, [6,0,0], 0);
	// Add arrow.
	controller.AddObject(arrowID,3,[0,0,6],0); 
	// Add sphere.
	controller.AddObject(sphereID,4,[1,0,6],0); 
	// Add ramp.
	controller.AddObject(rampID,5,[3,0,4],0);
	controller.CreateChains();
	var chains = controller.GetChains()[0];
	if (JSON.stringify(chains[0]) === JSON.stringify([-1,3,[0,0,6,1]])
		&& JSON.stringify(chains[1]) === JSON.stringify([-1,4,[2,0,6,1]])
		&& JSON.stringify(chains[2]) === JSON.stringify([5,4,[5,0,4,1]])
		&& JSON.stringify(chains[3]) === JSON.stringify([-2,4,[6,0,1,4]])
		&& chains[4] == null)
			console.log("Chaining test 1: passed.");
	else console.log("Chaining test 1: failed.");
	
	controller.ReInitializeAll();

	// Chaining test 2. Sphere rolls to edge of canvas.
	controller.AddObject(arrowID,0,[0,0,0],0);
	controller.AddObject(sphereID,1,[1,0,0],0);
	controller.CreateChains();
	chains = controller.GetChains()[0];
	if (JSON.stringify(chains[0]) === JSON.stringify([-1,0,[0,0,0,1]])
		&& JSON.stringify(chains[1]) === JSON.stringify([-1,1,[29,0,0,1]])
		&& chains[2] == null)
			console.log("Chaining test 2: passed.");
	else console.log("Chaining test 2: failed.");
	controller.ReInitializeAll();

	// Chaining test 3. No roamer next to arrow.
	controller.AddObject(arrowID,0,[0,0,0],0);
	controller.AddObject(sphereID,1,[2,0,0],0);
	controller.CreateChains();
	if (controller.GetChains()[0][1] == null) 
		console.log("Chaining test 3: passed.");
	else console.log("Chaining test 3: failed.");
	controller.ReInitializeAll();

	// Chaining test 4. Sphere rolls into dominoes.
	controller.AddObject(arrowID,0,[0,0,0],0);
	controller.AddObject(sphereID,1,[1,0,0],0);
	controller.AddObject(dominoID,2,[5,0,0],0);
	controller.CreateChains();
	chains = controller.GetChains()[0];
	if (JSON.stringify(chains[0]) === JSON.stringify([-1,0,[0,0,0,1]])
		&& JSON.stringify(chains[1]) === JSON.stringify([-1,1,[4,0,0,1]])
		&& JSON.stringify(chains[2]) === JSON.stringify([-1,2,[6,0,0,1]])
		&& chains[3] == null)
			console.log("Chaining test 4: passed.");
	else console.log("Chaining test 4: failed.");
	controller.ReInitializeAll();
	
	// Chaining test 5. Sphere rolls into other sphere.
	controller.AddObject(arrowID,0,[0,0,0],0);
	controller.AddObject(sphereID,1,[1,0,0],0);
	controller.AddObject(sphereID,2,[5,0,0],0);
	controller.CreateChains();
	chains = controller.GetChains()[0];
	if (JSON.stringify(chains[0]) === JSON.stringify([-1,0,[0,0,0,1]])
		&& JSON.stringify(chains[1]) === JSON.stringify([-1,1,[4,0,0,1]])
		&& JSON.stringify(chains[2]) === JSON.stringify([-1,2,[29,0,0,1]])
		&& chains[3] == null)
			console.log("Chaining test 5: passed.");
	else console.log("Chaining test 5: failed.");
	controller.ReInitializeAll();

	// Chaining test 6. Sphere rolls into block.
	controller.AddObject(arrowID,0,[0,0,0],0);
	controller.AddObject(sphereID,1,[1,0,0],0);
	controller.AddObject(blockID,2,[5,0,0],0);
	controller.CreateChains();
	chains = controller.GetChains()[0];
	if (JSON.stringify(chains[0]) === JSON.stringify([-1,0,[0,0,0,1]])
		&& JSON.stringify(chains[1]) === JSON.stringify([-1,1,[4,0,0,1]])
		&& chains[2] == null)
			console.log("Chaining test 6: passed.");
	else console.log("Chaining test 6: failed.");
	controller.ReInitializeAll();

	// Chaining test 7. Sphere rolls into wrong side of ramp.
	controller.AddObject(arrowID,0,[0,0,0],0);
	controller.AddObject(sphereID,1,[1,0,0],0);
	controller.AddObject(rampID,2,[5,0,0],1);
	controller.CreateChains();
	chains = controller.GetChains()[0];
	if (JSON.stringify(chains[0]) === JSON.stringify([-1,0,[0,0,0,1]])
		&& JSON.stringify(chains[1]) === JSON.stringify([-1,1,[4,0,0,1]])
		&& chains[2] == null)
			console.log("Chaining test 7: passed.");
	else console.log("Chaining test 7: failed.");
	controller.ReInitializeAll();

	// Chaining test 8. Sphere rolls up ramp and drops off side.
	// TODO: Fix iomap rotation so that it is correct. 
	/*controller.AddObject(arrowID,0,[0,0,0],0);
	controller.AddObject(sphereID,1,[1,0,0],0);
	controller.AddObject(rampID,2,[5,0,0],2);
	controller.CreateChains();
	chains = controller.GetChains()[0];
	console.log(chains);
	controller.PrintGrid();
	if (JSON.stringify(chains[0]) === JSON.stringify([-1,0,[0,0,0,1]])
		&& JSON.stringify(chains[1]) === JSON.stringify([-1,1,[4,0,0,1]])
		&& JSON.stringify(chains[2]) === JSON.stringify([2,1,[7,0,2,1]])
		&& JSON.stringify(chains[3]) === JSON.stringify([-2,1,[8,0,0,4]])
		&& chains[4] == null)
			console.log("Passed chaining test 8.");
	else console.log("Failed chaining test 8.");
	controller.ReInitializeAll();*/
	console.log ("Chaining test 8: Needs rotation of iomap fixed first.");

	// Chaining test 9. Sphere drops onto top side of ramp.
	// TODO: Write test.
	console.log ("Chaining test 9: Needs to be written and verified.");

	console.log("");
	// Grid placement tests --------------------------------------------------
	controller.AddObject(rampID,0,[5,0,3],0);
	var ramp2 = new RubeJect(3,[5,0,4],0);
	if (controller.CanPlaceObject(ramp2.blockList,ramp2.position,ramp2.category)) 
		console.log("Intersection test FAILED.");
	else console.log("Intersection test passed.");

	var sphere2 = new RubeJect(4,[10,0,3],0);
	if (controller.CanPlaceObject(sphere2.blockList,sphere2.position,sphere2.category)) 
		console.log("Floating test FAILED.");
	else console.log("Floating test passed.");

	var block2 = new RubeJect(1,[0,0,31],0);
	if (controller.CanPlaceObject(block2.blockList,block2.position,block2.blockList)) 
		console.log("Bounds test FAILED");
	else console.log("Bounds test passed.");
	// End grid placement tests ----------------------------------------------
	
	controller.ReInitializeAll();
	console.log("Finished controller testing ---------------------------------")
}