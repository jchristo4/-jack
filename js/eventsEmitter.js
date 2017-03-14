/*
 * Basic idea for this object is from David Walsh's blog post
 */
function EventsEmitter() {
  this.events = {};
}

EventsEmitter.prototype.on = function(event, listener) {
  let index;

  if (!this.events.hasOwnProperty(event)) {
    this.events[event] = [];
  }

  index = this.events[event].push(listener) - 1;

  return {
    remove: function() {
      delete this.events[event][index];
    }
  };
};


EventsEmitter.prototype.emit = function(event, data) {
  if (!this.events.hasOwnProperty(event)) return;

  this.events[event].forEach(function(item) {
    item(typeof data !== 'undefined' ? data : {});
  });
};