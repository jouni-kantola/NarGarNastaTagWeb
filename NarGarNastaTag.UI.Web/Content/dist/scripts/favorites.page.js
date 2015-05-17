webpackJsonp([2],[function(t,exports,e){(function($){var t=e(3),o=e(4),n=e(5),i=function(){function e(){this.stations=[],this.commuterController=new t,this.route=new o}return e.prototype.load=function(){this.showFavourites()},e.prototype.showFavourites=function(){var t=this,e=$("#favouriteItemTemplate").clone(),o=$("#favourites");o.html("").append(e),$.each(t.commuterController.getRoutes(),function(){var n=e.clone();n.prop("id",this.routeId).prop("fromStationCode",this.from.id).on("tap",function(e){e.preventDefault(),t.commuterController.remove($(this).prop("fromStationCode"),$(this).prop("id"),t.showFavourites)}),n.find(".ui-btn-text").text(this.from.name+" – "+this.to.name),n.appendTo(o).show()})},e.prototype.getStations=function(){var t=this;this.stations.length>0||this.commuterController.scrapeStations(function(e){try{$.each(e.data,function(){this&&!t.stations?(t.stations=[],t.stations.push(this)):this&&t.stations.push(this)})}catch(o){var i=new n;i.log("No access established to Trafikverket.",o)}})},e.prototype.loading=function(){var t=this;this.getStations(),$("#saveRouteButton").on("tap",function(e){e.preventDefault(),t.saveRoute()}),$(".searchStations").on("input",function(){var e=function(){var t=0;return function(e,o){clearTimeout(t),t=setTimeout(e,o)}}(),o=$(this),n=o.closest(".searchFields").find(".stations");e(function(){n.html("");var e=o.val().toUpperCase();if(e.length<2)return void n.hide();var i=[];$.each(t.stations,function(){if(0===this.Name.toUpperCase().indexOf(e)){var o=t.getStationSelector(this.Id,this.Name);i.push(o)}}),i.length>0?(n.append(i.join("")).listview("refresh").trigger("create"),n.find(".ui-icon-shadow").text(""),n.find(".ui-btn-inner").on("tap",function(e){t.confirmSelection($(this)),t.toggleSaveRouteButton()}),n.show()):n.fadeOut("fast")},300)}).on("keyup",function(e){if(13===e.which){var o=$(this),n=o.closest(".searchFields").find(".stations");if(n.children().length>0){var i=$(n.find("label")[0]).text(),r=$(n.find("input[type='checkbox']")).prop("name"),a=o.closest(".searchFields");a.find(".searchStations").val(i),t.setRoute(a,i,r),t.toggleSaveRouteButton()}n.fadeOut("slow").html("")}})},e.prototype.getStationSelector=function(t,e){var o=this.commuterController.idGenerator.getId();return'<li><input id="'+o+'" type="checkbox" name="'+t+'"/><label for="'+o+'">'+e+"</label></li>"},e.prototype.confirmSelection=function(t){var e=$(t).closest("div"),o=e.find("label").text(),n=e.find("input[type='checkbox']").prop("name"),i=e.closest(".searchFields");i.find(".searchStations").val(o),this.setRoute(i,o,n);var r=e.closest(".stations");r.fadeOut("slow").html("")},e.prototype.setRoute=function(t,e,o){t.hasClass("fromStation")?(this.route.from.name=e,this.route.from.id=o):(this.route.to.name=e,this.route.to.id=o)},e.prototype.toggleSaveRouteButton=function(){this.route.from.id&&this.route.to.id&&$("#saveRouteButton").show()},e.prototype.saveRoute=function(){this.route.from.id===this.route.to.id?$("#cannotSaveEqualToAndFromRoute").popup("open"):this.commuterController.add(this.route.from.name,this.route.from.id,this.route.to.name,this.route.to.id,this.showFavourites),this.route=new o,$(".searchStations").val(""),$("#saveRouteButton").hide()},e}(),r=new i;$("#favouritesPage").bind("pageinit",function(){r.loading()}),$("#favouritesPage").bind("pageshow",function(){r.load()})}).call(exports,e(2))}]);