import { BVHBuilder, BVHBuilderAsync } from '@src/BVHBuilder'
import { BVH as BVH_old } from '@src/bvhtree_old'
import { readFileSync } from 'fs'
import { countNodes } from '@src/utils';

const vertArraybuffer = readFileSync('./public/resources/models/bun_zipper.f32verts').buffer;
const masterArray = new Float32Array(vertArraybuffer);

const stackedTriangles = new Float32Array([
	0, 0, 0, // Normal triangle
	0, 0, 1,
	1, 0, 0,
	
	0, 0, 0, // Normal triangle
	0, 0, 1,
	1, 0, 0,
	
	0, 0, 0, // Normal triangle
	0, 0, 1,
	1, 0, 0,
	
	0, 0, 0, // Normal triangle
	0, 0, 1,
	1, 0, 0,
]);

interface Vector {
	x:number,
	y:number,
	z:number,
}

interface Face {
	0: Vector,
	1: Vector,
	2: Vector,
}

describe('BVHBuilders', () => {
	let anArray:Float32Array;
	let objArray:Face[];
	beforeAll(async () => {
		anArray = new Float32Array(vertArraybuffer);
		objArray = [];
		for(var i = 0; i < anArray.length; i += 9) {
			objArray.push([
				{x:anArray[i + 0], y:anArray[i + 1], z:anArray[i + 2]},
				{x:anArray[i + 3], y:anArray[i + 4], z:anArray[i + 5]},
				{x:anArray[i + 6], y:anArray[i + 7], z:anArray[i + 8]}
			]);
		}
	});

	test('BVHBuilder with XYZ objects', () => {
		let BVH = BVHBuilder(objArray, 10);
		expect(countNodes(BVH.rootNode)).toEqual(19755);
	});

	test('BVHBuilder with VertexFaces array', () => {
		let BVH = BVHBuilder(anArray, 10);
		expect(countNodes(BVH.rootNode)).toEqual(19755);
	});

	test('BVHBuilderAsync with XYZ objects', async () => {
		let BVH = await BVHBuilderAsync(objArray, 10);
		expect(countNodes(BVH.rootNode)).toEqual(19755);
	});

	test('BVHBuilderAsync with VertexFaces array', async () => {
		let BVH = await BVHBuilderAsync(anArray, 10, () => {

		});
		expect(countNodes(BVH.rootNode)).toEqual(19755);
	});
	
	test('BVHBuilderOld with XYZ objects', () => {
		let BVH:any = new BVH_old(objArray, 10);
		expect(countNodes(BVH._rootNode)).toEqual(19755);
	});
});

describe('BVHBuilders with unusual specs', () => {
	test('BVHBuilder with XYZ objects', () => {
		let BVH = BVHBuilder(stackedTriangles, 1);
		expect(countNodes(BVH.rootNode)).toEqual(1);
	});
});