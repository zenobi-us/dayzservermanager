<script setup lang="ts">
const props = defineProps({
  depth: {
    type: Number,
    default: 0,
  },
  element: [Element, Text],
})

enum NodeType {
  ELEMENT_NODE = 1,
  TEXT_NODE = 3,
  COMMENT_NODE = 8,
}

function isNode(element: unknown): element is Node {
  return typeof element === 'object' && !!element && 'nodeType' in element
}
function isElementNode(element: unknown): element is Element {
  return isNode(element) && element.nodeType === NodeType.ELEMENT_NODE
}
function isTextNode(element: unknown): element is Text {
  return  isNode(element) &&element.nodeType === NodeType.TEXT_NODE
}
function isCommentNode(element: unknown): element is Comment {
  return isNode(element) && element.nodeType === NodeType.COMMENT_NODE
}

function collapse(event: MouseEvent) {
  const element = event.target
  if (!(element instanceof HTMLElement)) return
  Array.from(element.children).forEach(x => x.classList?.add("d-none"))
}

function children(element: Element | Text) {
  let children: (Element|Text)[] = []
  let node = element.firstChild
  while (node) {
    if (!isElementOrTextNode(node)) {
      node = node.nextSibling
      continue
    }

    children.push(node)
    node = node.nextSibling
  }
  return children
}

function isElementOrTextNode(element: unknown): element is Element | Text {
  return element instanceof Element || element instanceof Text
}

function hasChildren(element?: Element | Text) {
  if (!element) { return false }
  if (element.nodeType === Node.TEXT_NODE) return false
  if (element.nodeType === Node.ELEMENT_NODE && 'children' in element)  {
    return element.children.length > 0
  }
  return false
}

function elementAttributes(element: Element | Text) {
  return 'attributes' in element
    ? element.attributes
    : []

}
function hasAttributes(element: Element | Text) {
  return elementAttributes(element).length > 0
}
</script>

<template>
  <div v-if="isElementNode(props.element)" :style="'padding-left: ' + (props.depth * 10) + 'px'">
    <span class="d-flex">
        <span
            v-if="hasChildren(props.element)"
            class="bi-dash simulink text-center"
            @click="collapse"
        />
        <span>&lt;{{props.element.nodeName}}</span>
        <span v-if="hasAttributes(props.element)" v-for="attribute in elementAttributes(props.element)">
            <span>&nbsp;{{attribute.name}}</span>
            <span>=</span>
            <span>"{{attribute.value}}"</span>
        </span>
        <span v-if="!hasChildren(props.element)">&nbsp;/</span>
        <span>></span>
    </span>
    <span v-for="child in children(props.element)">
      <XmlTree v-if="isCommentNode(child)" :element="child" :depth="props.depth + 1" />
    </span>
    <span
        v-if="props.element.nodeType === 1"
        style="padding-left: -10px"
    >
        <span>&lt;/{{props.element.nodeName}}></span>
    </span>
  </div>
  <span v-if="isTextNode(props.element)">{{props.element.data.trim()}}</span>
</template>
