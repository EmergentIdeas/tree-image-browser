import mocha from "mocha";
import {assert} from 'chai'
import tu from '../utils/test-util.js'
import baseImageName from "../client-lib/base-image-name.mjs";

describe("a basic test which shows tests are working", function() {
	
	it("test base name", function() {
		assert.equal(baseImageName('big-file-2x.jpg'), 'big-file')
		assert.equal(baseImageName('big-file-@2x.jpg'), 'big-file')
		assert.equal(baseImageName('big-file2x.jpg'), 'big-file')
		assert.equal(baseImageName('big-file@2x.jpg'), 'big-file')

		assert.equal(baseImageName('Big file@2x.jpg'), 'big-file')
		assert.equal(baseImageName('Big  file@2x.jpg'), 'big-file')
		assert.equal(baseImageName('Big  f_24ile@2x.jpg'), 'big-f-24ile')

		assert.equal(baseImageName('HelloThere.jpg'), 'hello-there')
	})
	it("two times two", function() {
		assert.equal(tu(2, 2), 4)
	})
	it("two times 3", function() {
		assert.equal(tu(2, 3), 6)
	})

})