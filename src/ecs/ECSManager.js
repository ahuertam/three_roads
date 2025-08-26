export class ECSManager {
  constructor() {
    this.entities = new Map();
    this.components = new Map();
    this.systems = [];
    this.nextEntityId = 0;
    this.entitiesToRemove = new Set(); // Para cleanup seguro
  }
  
  createEntity(tag = null) {
    const id = this.nextEntityId++;
    const entity = new Entity(id, this);
    this.entities.set(id, entity);
    
    if (tag) {
      entity.addTag(tag);
    }
    
    return entity;
  }
  
  removeEntity(id) {
    this.entitiesToRemove.add(id);
  }
  
  // Cleanup seguro de entidades
  cleanupEntities() {
    this.entitiesToRemove.forEach(id => {
      this.entities.delete(id);
      this.components.delete(id);
    });
    this.entitiesToRemove.clear();
  }
  
  addComponent(entityId, component) {
    if (!this.components.has(entityId)) {
      this.components.set(entityId, new Map());
    }
    this.components.get(entityId).set(component.constructor.name, component);
  }
  
  getComponent(entityId, ComponentClass) {
    const componentName = typeof ComponentClass === 'string' ? ComponentClass : ComponentClass.name;
    return this.components.get(entityId)?.get(componentName);
  }
  
  getEntitiesWithComponents(componentClasses) {
    const entities = [];
    
    for (const [entityId, entity] of this.entities) {
      const hasAllComponents = componentClasses.every(ComponentClass => {
        const componentName = typeof ComponentClass === 'string' ? ComponentClass : ComponentClass.name;
        return this.components.get(entityId)?.has(componentName);
      });
      
      if (hasAllComponents) {
        entities.push(entity);
      }
    }
    
    return entities;
  }
  
  getEntitiesWithTag(tag) {
    return Array.from(this.entities.values()).filter(entity => entity.hasTag(tag));
  }
  
  addSystem(system) {
    this.systems.push(system);
  }
  
  update(delta) {
    this.systems.forEach(system => {
      if (system.update) {
        system.update(delta);
      }
    });
    
    // Limpiar entidades marcadas para eliminación
    this.cleanupEntities();
  }
}

class Entity {
  constructor(id, ecsManager) {
    this.id = id;
    this.ecsManager = ecsManager;
    this.tags = new Set();
  }
  
  addComponent(component) {
    this.ecsManager.addComponent(this.id, component);
    return this;
  }
  
  getComponent(ComponentClass) {
    return this.ecsManager.getComponent(this.id, ComponentClass);
  }
  
  addTag(tag) {
    this.tags.add(tag);
    return this;
  }
  
  hasTag(tag) {
    return this.tags.has(tag);
  }
  
  destroy() {
    this.ecsManager.removeEntity(this.id);
  }
}