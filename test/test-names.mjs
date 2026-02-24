import test from "node:test"
import assert from "node:assert"
import baseImageName from "../client-lib/base-image-name.mjs";


await test("basic tests for functionality", async function (t) {
	await t.test("name comparison", function () {
		assert.equal(baseImageName('big-file-2x.jpg'), 'big-file')
		assert.equal(baseImageName('big-file-@2x.jpg'), 'big-file')
		assert.equal(baseImageName('big-file2x.jpg'), 'big-file')
		assert.equal(baseImageName('big-file@2x.jpg'), 'big-file')

		assert.equal(baseImageName('Big file@2x.jpg'), 'big-file')
		assert.equal(baseImageName('Big  file@2x.jpg'), 'big-file')
		assert.equal(baseImageName('Big  f_24ile@2x.jpg'), 'big-f-24ile')

		assert.equal(baseImageName('HelloThere.jpg'), 'hello-there')

	})
})