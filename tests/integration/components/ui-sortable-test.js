import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

var people;

moduleForComponent('ui-sortable', 'Integration | Component | ui sortable', {
  integration: true,
  beforeEach() {
    people = Ember.A([
      { name: 'Han' },
      { name: 'Luke' },
      { name: 'Leia' }
    ]);
  }
});

// Set any properties with this.set('myProperty', 'value');
// Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

test('should render the template for each item in an array', function(assert) {
  this.set('people', people);

  this.render(hbs`
    {{#ui-sortable content=people as |item|}}
      <li>{{item.name}}</li>
    {{/ui-sortable}}
  `);

  assert.equal(this.$('li').length, 3);
  assert.equal(this.$('li').text(), 'HanLukeLeia');
});

test('should update the component is content is replaced', function(assert) {
  this.set('people', people);

  this.render(hbs`
    {{#ui-sortable content=people as |item|}}
      <li>{{item.name}}</li>
    {{/ui-sortable}}
  `);

  assert.equal(this.$('li').length, 3);
  assert.equal(this.$('li').text(), 'HanLukeLeia');

  this.set('people', Ember.A([
    { name: 'Sue' },
    { name: 'Reed' }
  ]));

  assert.equal(this.$('li').length, 2);
  assert.equal(this.$('li').text(), 'SueReed');
});

test('should update the component if an item is added', function (assert) {
  this.set('people', people);

  this.render(hbs`
    {{#ui-sortable content=people as |item|}}
      <li>{{item.name}}</li>
    {{/ui-sortable}}
  `);

  Ember.run(function() {
    people.pushObject({ name: 'Chewbacca' });
  });
  assert.equal(this.$('li').length, 4);
  assert.equal(this.$('li').text(), 'HanLukeLeiaChewbacca');
});

test('should update the component if an item is removed', function (assert) {
  this.set('people', people);

  this.render(hbs`
    {{#ui-sortable content=people as |item|}}
      <li>{{item.name}}</li>
    {{/ui-sortable}}
  `);

  Ember.run(function() {
    people.removeAt(0);
  });
  assert.equal(this.$('li').length, 2);
  assert.equal(this.$('li').text(), 'LukeLeia');
});

test('should update the component if an item is replaced', function(assert) {
  this.set('people', people);
  this.set('moved', () => assert.ok(true) );

  this.render(hbs`
    {{#ui-sortable content=people moved=moved as |item|}}
      <li>{{item.name}}</li>
    {{/ui-sortable}}
  `);

  Ember.run(function() {
    people.removeAt(0);
    people.insertAt(0, { name: 'Finn' });
  });
  assert.equal(this.$('li').length, 3);
  assert.equal(this.$('li').text(), 'FinnLukeLeia');
});

test('should update the content if an item is dragged', function(assert) {
  this.set('people', people);
  this.set('moved', () => assert.ok(true) );

  this.render(hbs`
    {{#ui-sortable content=people moved=(action moved) as |item|}}
      <li>{{item.name}}</li>
    {{/ui-sortable}}
  `);

  this.$('li:eq(0)').simulate('drag', { dy: 22 });
  assert.equal(this.$('li').length, 3);
  assert.equal(this.$('li').text(), 'LukeHanLeia');
  assert.deepEqual(people.mapBy('name'), ['Luke', 'Han', 'Leia']);
});

test('should become disabled if the disabled attribute is true', function(assert) {
  this.set('people', people);
  this.set('moved', () => assert.ok(true) );
  this.set('disabled', true);

  this.render(hbs`
    {{#ui-sortable content=people moved=(action moved) disabled=disabled as |item|}}
      <li>{{item.name}}</li>
    {{/ui-sortable}}
  `);

  this.$('li:eq(0)').simulate('drag', { dy: 22 });
  assert.equal(this.$('li').text(), 'HanLukeLeia', 'Setting disabled to true disables dragging');
  assert.deepEqual(people.mapBy('name'), ['Han', 'Luke', 'Leia']);

  this.set('disabled', false);
  this.$('li:eq(0)').simulate('drag', { dy: 22 });
  assert.equal(this.$('li').text(), 'LukeHanLeia', 'Setting disabled to false enables dragging');
  assert.deepEqual(people.mapBy('name'), ['Luke', 'Han', 'Leia']);
});

test('should trigger moved action after successful drag', function(assert) {
  this.set('people', people);
  this.set('moved', (item, oldIndex, newIndex) => {
    assert.strictEqual(item, people.objectAt(newIndex));
    assert.equal(oldIndex, 0);
    assert.equal(newIndex, 1);
  });

  this.render(hbs`
    {{#ui-sortable content=people disabled=disabled moved=(action moved) as |item|}}
      <li>{{item.name}}</li>
    {{/ui-sortable}}
  `);

  this.$('li:eq(0)').simulate('drag', { dy: 22 });
});

test('should not refresh after destruction', function(assert) {
  assert.expect(1);

  this.set('people', people);
  this.set('showComponent', true);

  this.render(hbs`
    {{#if showComponent}}
      {{#ui-sortable content=people as |item|}}
        <li>{{item.name}}</li>
      {{/ui-sortable}}
    {{/if}}
  `);

  Ember.run(function() {
    people.pushObject({ name: 'Chewbacca' });
  });
  this.set('showComponent', false);

  assert.ok(true, 'no error was thrown');
});

test('should update jQuery UI axis option when axis property changes', function(assert) {
  this.set('people', people);

  let options = {
    'axis': false,
    'containment': false,
    'cursor': 'auto',
    'cursorAt': false,
    'delay': 0,
    'disabled': false,
    'distance': 1,
    'forceHelperSize': false,
    'forcePlaceholderSize': false,
    'grid': false,
    'handle': false,
    'opacity': false,
    'revert': false,
    'scroll': true,
    'scrollSensitivity': 20,
    'scrollSpeed': 20,
    'tolerance': 'intersect',
    'zIndex': 1000
  };

  let afterOptions = {
    'axis': 'x',
    'containment': 'parent',
    'cursor': 'move',
    'cursorAt': { left: 5 },
    'delay': 150,
    'disabled': true,
    'distance': 5,
    'forceHelperSize': true,
    'forcePlaceholderSize': true,
    'grid': [20, 10],
    'handle': '.handle',
    'opacity': 0.5,
    'revert': true,
    'scroll': false,
    'scrollSensitivity': 10,
    'scrollSpeed': 40,
    'tolerance': 'pointer',
    'zIndex': 9999
  };

  this.setProperties(options);

  this.render(hbs`
    {{#ui-sortable content=people
                   axis=axis
                   containment=containment
                   cursor=cursor
                   cursorAt=cursorAt
                   delay=delay
                   disabled=disabled
                   distance=distance
                   forceHelperSize=forceHelperSize
                   forcePlaceholderSize=forcePlaceholderSize
                   grid=grid
                   handle=handle
                   helper=helper
                   opacity=opacity
                   placeholder=placeholder
                   revert=revert
                   scroll=scroll
                   scrollSensitivity=scrollSensitivity
                   scrollSpeed=scrollSpeed
                   tolerance=tolerance
                   zIndex=zIndex
                   as |item|}}
      <li>{{item.name}}</li>
    {{/ui-sortable}}
  `);

  Object.keys(options).forEach(key => assert.equal(this.$('.ui-sortable').sortable('option', key), options[key],
      'precondition - initial value of ' + key + ' option is correct'));


  this.setProperties(afterOptions);

  Object.keys(afterOptions).forEach(key => assert.equal(this.$('.ui-sortable').sortable('option', key), afterOptions[key],
      key + ' option is updated after ' + key + ' property is changed'));
});


