

function ControllerTest(){
	// CONTROLLER TESTING THINGS -------------------------------------------
	console.log("CONTROLLER TESTING ------------------------------------------");	

	var blockID = 1; var dominoID = 2; var rampID = 3; var sphereID = 4; var arrowID = 5; 
	var sRailID = 6; var lRailID = 7; var columnID = 8; 

	// Chaining test 1. Sphere rolls across blocks, down ramp, falls down.
	// Add blocks.
	controller.AddObject(blockID, 0, [1,0,5], 0);
	controller.AddObject(blockID, 1, [2,0,5], 0);
	controller.AddObject(blockID, 2, [6,0,3], 0);
	controller.AddObject(blockID, 6, [7,0,3], 0);
	controller.AddObject(blockID, 7, [8,0,3], 0);
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
		&& JSON.stringify(chains[3]) === JSON.stringify([-1,4,[8,0,4,1]])
		&& JSON.stringify(chains[4]) === JSON.stringify([-2,4,[9,0,0,4]])
		&& chains[5] == null)
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
	controller.AddObject(arrowID,0,[0,0,0],0);
	controller.AddObject(sphereID,1,[1,0,0],0);
	controller.AddObject(rampID,2,[5,0,0],2);
	controller.CreateChains();
	chains = controller.GetChains()[0];
	if (JSON.stringify(chains[0]) === JSON.stringify([-1,0,[0,0,0,1]])
		&& JSON.stringify(chains[1]) === JSON.stringify([-1,1,[4,0,0,1]])
		&& JSON.stringify(chains[2]) === JSON.stringify([2,1,[7,0,2,1]])
		&& JSON.stringify(chains[3]) === JSON.stringify([-2,1,[8,0,0,4]])
		&& chains[4] == null)
			console.log ("Chaining test 8: passed.");
	else console.log ("Chaining test 8: failed.");
	controller.ReInitializeAll();
	

	// Chaining test 9. Sphere drops onto top side of ramp.
	// TODO: Write test.
	controller.AddObject(blockID,0,[0,0,0],0);
	controller.AddObject(blockID,1,[1,0,0],0);
	controller.AddObject(columnID,2,[0,0,1],0);
	controller.AddObject(columnID,3,[1,0,1],0);
	controller.AddObject(arrowID,4,[0,0,3],0);
	controller.AddObject(sphereID,5,[1,0,3],0);
	controller.AddObject(rampID,6,[2,0,0],0);
	controller.CreateChains();
	chains = controller.GetChains()[0];
	if (JSON.stringify(chains[0]) === JSON.stringify([-1,4,[0,0,3,1]])
		&& JSON.stringify(chains[1]) === JSON.stringify([-1,5,[1,0,3,1]])
		&& JSON.stringify(chains[2]) === JSON.stringify([-2,5,[2,0,2,4]])
		&& JSON.stringify(chains[3]) === JSON.stringify([6,5,[4,0,0,1]])
		&& JSON.stringify(chains[4]) === JSON.stringify([-1,5,[29,0,0,1]])
		&& chains[5] == null)
			console.log ("Chaining test 9: passed.");
	else console.log ("Chaining test 9: failed.");
	controller.ReInitializeAll();

	// Chaining test 10. Sphere rolls across blocks, down ramp, across ground.
	// Add blocks.
	controller.AddObject(blockID, 0, [1,0,0], 0);
	controller.AddObject(blockID, 1, [2,0,0], 0);
	controller.AddObject(blockID, 2, [1,0,1], 0);
	controller.AddObject(blockID, 6, [2,0,1], 0);
	// Add arrow.
	controller.AddObject(arrowID,3,[0,0,2],0); 
	// Add sphere.
	controller.AddObject(sphereID,4,[1,0,2],0); 
	// Add ramp.
	controller.AddObject(rampID,5,[3,0,0],0);
	controller.CreateChains();
	var chains = controller.GetChains()[0];
	if (JSON.stringify(chains[0]) === JSON.stringify([-1,3,[0,0,2,1]])
		&& JSON.stringify(chains[1]) === JSON.stringify([-1,4,[2,0,2,1]])
		&& JSON.stringify(chains[2]) === JSON.stringify([5,4,[5,0,0,1]])
		&& JSON.stringify(chains[3]) === JSON.stringify([-1,4,[29,0,0,1]])
		&& chains[4] == null)
			console.log("Chaining test 10: passed.");
	else console.log("Chaining test 10: failed.");
	controller.ReInitializeAll();	

	// Chaining test 11. Sphere rolls across blocks, then over rails.
	// Add arrow.
	controller.AddObject(arrowID,2,[0,0,0],0); 
	// Add sphere.
	controller.AddObject(sphereID,3,[1,0,0],0); 
	// Add rails.
	controller.AddObject(sRailID,4,[2,0,0],0);
	controller.AddObject(lRailID,5,[3,0,0],0);
	controller.CreateChains();
	var chains = controller.GetChains()[0];
	if (JSON.stringify(chains[0]) === JSON.stringify([-1,2,[0,0,0,1]])
		&& JSON.stringify(chains[1]) === JSON.stringify([-1,3,[1,0,0,1]])
		&& JSON.stringify(chains[2]) === JSON.stringify([4,3,[2,0,0,1]])
		&& JSON.stringify(chains[3]) === JSON.stringify([5,3,[5,0,0,1]])
		&& chains[4] == null)
			console.log("Chaining test 11: passed.");
	else console.log("Chaining test 11: failed.");
	controller.ReInitializeAll();

	// Chaining test 12. Arrow next to not-a-roamer/gadget
	controller.AddObject(arrowID,0,[0,0,0],0);
	controller.AddObject(blockID,1,[1,0,0],0);
	controller.CreateChains();
	chains = controller.GetChains()[0];
	if (JSON.stringify(chains[0]) === JSON.stringify([-1,0,[0,0,0,1]])
		&& chains[1] == null)
			console.log("Chaining test 12: passed.");
	else console.log("Chaining test 2: failed.");
	controller.ReInitializeAll();

	// Chaining test 13. Arrow to gadget
	controller.AddObject(arrowID,0,[0,0,0],0);
	controller.AddObject(dominoID,1,[1,0,0],0);
	controller.CreateChains();
	chains = controller.GetChains()[0];
	if (JSON.stringify(chains[0]) === JSON.stringify([-1,0,[0,0,0,1]])
		&& JSON.stringify(chains[1]) === JSON.stringify([-1,1,[2,0,0,1]])
		&& chains[2] == null)
			console.log("Chaining test 13: passed.");
	else console.log("Chaining test 13: failed.");
	controller.ReInitializeAll();

	// Chaining test 14. Arrow to gadget to ball.
	controller.AddObject(arrowID,0,[0,0,0],0);
	controller.AddObject(dominoID,1,[1,0,0],0);
	controller.AddObject(sphereID,2,[3,0,0],0);
	controller.CreateChains();
	chains = controller.GetChains()[0];
	if (JSON.stringify(chains[0]) === JSON.stringify([-1,0,[0,0,0,1]])
		&& JSON.stringify(chains[1]) === JSON.stringify([-1,1,[2,0,0,1]])
		&& JSON.stringify(chains[2]) === JSON.stringify([-1,2,[29,0,0,1]])
		&& chains[3] == null)
			console.log("Chaining test 14: passed.");
	else console.log("Chaining test 14: failed.");
	controller.ReInitializeAll();

	// Chaining test 15. Sphere rolls across blocks, then over rails.
	// Add blocks.
	controller.AddObject(blockID, 0, [0,7,0], 0);
	controller.AddObject(blockID, 1, [0,6,0], 0);
	controller.AddObject(arrowID,2,[0,7,1],1); 
	controller.AddObject(sphereID,3,[0,6,1],0); 
	controller.AddObject(sRailID,4,[0,5,0],1);
	controller.CreateChains();
	var chains = controller.GetChains()[0];
	if (JSON.stringify(chains[0]) === JSON.stringify([-1,2,[0,7,1,2]])
		&& JSON.stringify(chains[1]) === JSON.stringify([-1,3,[0,6,1,2]])
		&& JSON.stringify(chains[2]) === JSON.stringify([4,3,[0,5,1,2]])
		&& JSON.stringify(chains[3]) === JSON.stringify([-2,3,[0,4,0,4]])
		&& chains[4] == null)
			console.log("Chaining test 15: passed.");
	else console.log("Chaining test 15: failed.");
	controller.ReInitializeAll();
	

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