/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozRating extends MozXULElement {
  constructor() {
    super();

    this.addEventListener("mouseout", (event) => {
      this._updateStars();
    });

  }

  connectedCallback() {

    this.appendChild(MozXULElement.parseXULToFragment(`
      <image class="star" onmouseover="document.getBindingParent(this)._hover(1);" onclick="document.getBindingParent(this).userRating = 1;"></image>
      <image class="star" onmouseover="document.getBindingParent(this)._hover(2);" onclick="document.getBindingParent(this).userRating = 2;"></image>
      <image class="star" onmouseover="document.getBindingParent(this)._hover(3);" onclick="document.getBindingParent(this).userRating = 3;"></image>
      <image class="star" onmouseover="document.getBindingParent(this)._hover(4);" onclick="document.getBindingParent(this).userRating = 4;"></image>
      <image class="star" onmouseover="document.getBindingParent(this)._hover(5);" onclick="document.getBindingParent(this).userRating = 5;"></image>
    `));

    this._updateStars();

  }

  get stars() {
    return document.getAnonymousNodes(this);
  }

  set averageRating(val) {
    this.setAttribute("averagerating", val);
    if (this.showRating == "average")
      this._updateStars();
  }

  get averageRating() {
    if (this.hasAttribute("averagerating"))
      return this.getAttribute("averagerating");
    return -1;
  }

  set userRating(val) {
    if (this.showRating != "user")
      return;
    this.setAttribute("userrating", val);
    if (this.showRating == "user")
      this._updateStars();
  }

  get userRating() {
    if (this.hasAttribute("userrating"))
      return this.getAttribute("userrating");
    return -1;
  }

  set showRating(val) {
    if (val != "average" || val != "user")
      throw Components.Exception("Invalid value", Cr.NS_ERROR_ILLEGAL_VALUE);
    this.setAttribute("showrating", val);
    this._updateStars();
  }

  get showRating() {
    if (this.hasAttribute("showrating"))
      return this.getAttribute("showrating");
    return "average";
  }

  _updateStars() {
    var stars = this.stars;
    var rating = this[this.showRating + "Rating"];
    // average ratings can be non-whole numbers, round them so they
    // match to their closest star
    rating = Math.round(rating);
    for (let i = 0; i < stars.length; i++)
      stars[i].setAttribute("on", rating > i);
  }

  _hover(aScore) {
    if (this.showRating != "user")
      return;
    var stars = this.stars;
    for (let i = 0; i < stars.length; i++)
      stars[i].setAttribute("on", i <= (aScore - 1));
  }
}

customElements.define("rating", MozRating);

}
