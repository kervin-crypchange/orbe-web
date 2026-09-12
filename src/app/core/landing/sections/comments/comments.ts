import { Component } from '@angular/core';

@Component({
  selector: 'app-comments',
  imports: [],
  templateUrl: './comments.html',
  styleUrl: './comments.css',
})
export class Comments {
  commensts = [
    {
      avatar:'https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png',
      comment:'Encontre una asesora con la que conecté desde el primer momento. La experiencia fia increible.',
      name:'Laura M.'
    },
    {
      avatar:'https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png',
      comment:'Encontre una asesora con la que conecté desde el primer momento. La experiencia fia increible.',
      name:'Laura M.'
    },
    {
      avatar:'https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png',
      comment:'Encontre una asesora con la que conecté desde el primer momento. La experiencia fia increible.',
      name:'Laura M.'
    },
  ]
}
