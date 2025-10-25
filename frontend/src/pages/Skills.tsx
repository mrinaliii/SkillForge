import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SkillCard from '../components/SkillCard';
import { mockSkills } from '../data/mockData';
import { Plus, Search, Filter, X } from 'lucide-react';

const Skills = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortBy, setSortBy] = useState<'retention' | 'name' | 'lastUsed'>('retention');

  const categories = ['All', 'Frontend', 'Backend', 'DevOps', 'Mobile', 'Data Science'];

  const filteredSkills = mockSkills
    .filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'retention') return a.retention - b.retention;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'lastUsed') return b.daysUnused - a.daysUnused;
      return 0;
    });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Skills Management</h1>
          <p className="opacity-60">Track and practice your technical skills</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 text-white"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          <Plus className="w-5 h-5" />
          Add Skill
        </button>
      </div>

      <div
        className="rounded-xl p-6 border"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-lg"
            style={{ backgroundColor: 'var(--background)' }}
          >
            <Search className="w-5 h-5 opacity-40" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none flex-1"
              style={{ color: 'var(--text)' }}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 opacity-40" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 rounded-lg border-none outline-none"
              style={{ backgroundColor: 'var(--background)', color: 'var(--text)' }}
            >
              <option value="retention">Sort by Retention</option>
              <option value="name">Sort by Name</option>
              <option value="lastUsed">Sort by Last Used</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
              style={{
                backgroundColor: selectedCategory === category ? 'var(--primary)' : 'var(--background)',
                color: selectedCategory === category ? 'white' : 'var(--text)'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((skill, index) => (
          <div key={skill.id} style={{ animationDelay: `${index * 50}ms` }}>
            <SkillCard
              skill={skill}
              variant="compact"
              onClick={() => navigate(`/skills/${skill.id}`)}
            />
          </div>
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <div
          className="rounded-xl p-12 text-center border"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
        >
          <p className="text-6xl mb-4">🔍</p>
          <h3 className="text-xl font-bold mb-2">No skills found</h3>
          <p className="opacity-60 mb-4">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-6 py-2 rounded-lg font-medium transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--primary)', color: 'white' }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            className="rounded-2xl p-8 max-w-md w-full animate-scale-in shadow-2xl"
            style={{ backgroundColor: 'var(--card-bg)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Add New Skill</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-lg transition-all hover:scale-110"
                style={{ backgroundColor: 'var(--background)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Skill Name</label>
                <input
                  type="text"
                  placeholder="e.g., React, Python, Docker"
                  className="w-full px-4 py-3 rounded-lg border outline-none"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--card-border)',
                    color: 'var(--text)'
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  className="w-full px-4 py-3 rounded-lg border outline-none"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--card-border)',
                    color: 'var(--text)'
                  }}
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Data Science">Data Science</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Proficiency Level: <span className="font-bold">5/10</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  defaultValue="5"
                  className="w-full"
                />
                <div className="flex justify-between text-xs opacity-60 mt-1">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Advanced</span>
                  <span>Expert</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Last Used</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 rounded-lg border outline-none"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--card-border)',
                    color: 'var(--text)'
                  }}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 rounded-lg font-medium transition-all hover:scale-105"
                  style={{ backgroundColor: 'var(--background)', color: 'var(--text)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-lg font-medium transition-all hover:scale-105 text-white"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  Add Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Skills;
