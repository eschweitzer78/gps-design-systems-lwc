import { LightningElement, api } from "lwc";

export default class extends LightningElement {
  @api accessibilityLabel = "yo accessibility"; // data-description
  @api drag;
  _loop = true;
  @api get loop() {
    return this._loop;
  }
  set loop(value) {
    this._loop = value;
  }
  @api navigation = false; // data-navigation; vs off
  @api navigationPagination = false;
  @api overflowItems = false;
  @api justifyContent;
  @api navigationItemClassName;
  @api navigationClassName;
  @api paginationClassName;
  @api className;

  items = [
    {
      cstyle: "highlight",
      headline: true,
      orientation: "vertical",
      tag: null,
      date: null,
      dateStyle: null,
      image:
        "https://images.unsplash.com/photo-1502085671122-2d218cd434e6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      imageAlt: "yo",
      title: "[Nominations open for Green Globe Awards 2019](#)",
      copy: "The annual awards will recognise individuals and organisations for their leadership , commitment and innovation in sustainability across NSW."
    },
    {
      cstyle: "highlight",
      headline: true,
      orientation: "vertical",
      tag: null,
      date: null,
      dateStyle: null,
      image:
        "https://images.unsplash.com/photo-1587752799766-8eb9791261d4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      imageAlt: "yo",
      title: "[Quality green spaces and a million more trees for NSW](#)",
      copy: "The NSW Government will create more quality green spaces and increase ther tree canopy in Sydney bt 2022."
    },
    {
      cstyle: "highlight",
      headline: true,
      orientation: "vertical",
      tag: null,
      date: null,
      dateStyle: null,
      image:
        "https://images.unsplash.com/photo-1642636497287-1183da9dd103?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      imageAlt: "yo",
      title:
        "[New Premier's Priority to lift literacy and numeracy standards](#)",
      copy: "The NSW Government will redouble its efforts to lift literacy and numeracy standards across NSW public schools to ensure students are given every opportunity to be their best."
    },
    {
      cstyle: "highlight",
      headline: true,
      orientation: "vertical",
      tag: null,
      date: null,
      dateStyle: null,
      image:
        "https://images.unsplash.com/photo-1589913864122-ada28c04fdd1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      imageAlt: "yo",
      title: "[Some big large title for Card Number 4](#)",
      copy: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a lacinia nisi. Duis rutrum at quam eget euismod. Morbi est lectus, aliquet vel neque id, elementum pellentesque enim."
    },
    {
      cstyle: "highlight",
      headline: true,
      orientation: "vertical",
      tag: null,
      date: null,
      dateStyle: null,
      image:
        "https://images.unsplash.com/photo-1655434065501-246b35310ab7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      imageAlt: "yo",
      title: "[Other big large title for Card Number 5](#)",
      copy: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a lacinia nisi. Duis rutrum at quam eget euismod. Morbi est lectus, aliquet vel neque id, elementum pellentesque enim."
    },
    {
      cstyle: "highlight",
      headline: true,
      orientation: "vertical",
      tag: null,
      date: null,
      dateStyle: null,
      image:
        "https://images.unsplash.com/photo-1655434067144-b962fd5fc053?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      imageAlt: "yo",
      title: "[Ramdom title for Card Number 6](#)",
      copy: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a lacinia nisi. Duis rutrum at quam eget euismod. Morbi est lectus, aliquet vel neque id, elementum pellentesque enim."
    },
    {
      cstyle: "highlight",
      headline: true,
      orientation: "vertical",
      tag: null,
      date: null,
      dateStyle: null,
      image:
        "https://images.unsplash.com/photo-1594121292235-7c01bf21b2c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      imageAlt: "yo",
      title: "[Managing some stuff in Card Number 7](#)",
      copy: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a lacinia nisi. Duis rutrum at quam eget euismod. Morbi est lectus, aliquet vel neque id, elementum pellentesque enim."
    }
  ];
}
