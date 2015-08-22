$(function () {
	$.get('/blocks', appendToList);

	function appendToList (blocks) {
		var list = [];
		for (var i in blocks) {
			var block = blocks[i];
			
			var blockRemoveBtn = $('<a>', { href: '#', 'data-block': block, class: 'glyphicon glyphicon-remove' });
			var blockLink = $('<a>', { href: '/blocks/' + block, text: block });
			list.push($('<li>', { html: blockRemoveBtn.add(blockLink) }));
		}

		$('.block-list').append(list);
	}

	$('form').on('submit', function (e) {
		e.preventDefault();

		var form = $(this);
		var blockData = form.serialize();

		$.ajax({
			type: 'POST',
			url: '/blocks',
			data: blockData
		}).done(function (blockName) {
			appendToList([ blockName ]);
			form.trigger('reset');
		}).error(function (err) {
			console.log(err);
		});
	});

	$('.block-list').on('click', 'a[data-block]', function (event) {
		if (!confirm('Are you sure?')) {
			return false;
		}

		var target = $(event.currentTarget);

		$.ajax({
			type: 'DELETE',
			url: '/blocks/' + target.data('block')
		}).done(function () {
			target.parent('li').remove();
		}).error(function (err) {
			console.log(err);
		});
	});
});