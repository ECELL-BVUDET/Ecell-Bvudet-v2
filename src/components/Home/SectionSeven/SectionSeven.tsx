import React, { useState } from "react";
import { createPortal } from "react-dom";
import Marquee from "react-fast-marquee";
import S from "./SectionSeven.module.scss";

type SectionSevenProps = {
	windowWidth: number;
};

type Mentor = {
	name: string;
	email: string;
	phone: string;
	linkedin: string;
	designation: string;
	organization: string;
	location: string;
	experience: string;
	industry: string;
	expertise: string;
	availability: string;
	timeCommitment: string;
	maxStartups: string;
	startupStage: string;
	description: string;
};

const mentors: Mentor[] = [
	{
		name: "KANHAYYA GUPTA",
		email: "kanhacet@gmail.com",
		phone: "9326650454",
		linkedin: "https://www.linkedin.com/in/kanhayya-gupta/",
		designation: "AI Engineer",
		organization: "Pixels Creative Technologies",
		location: "Mumbai",
		experience: "1 year",
		industry: "AI / ML, Healthcare",
		expertise: "Tech / Product Development, Operations",
		availability: "Both",
		timeCommitment: "4 hours",
		maxStartups: "More than 3",
		startupStage: "MVP",
		description: "AI engineer and startup founder building SaaS products and AI automation tools. 4x National Hackathon Winner with experience mentoring at five national hackathons.",
	},
	{
		name: "SOMANATH DIKSANGI",
		email: "somanathdiksangi@gmail.com",
		phone: "8433688163",
		linkedin: "https://www.linkedin.com/in/somanath-diksangi-63868627a/",
		designation: "AI Engineer",
		organization: "flytbase",
		location: "Pune",
		experience: "2 years",
		industry: "SaaS, AI / ML",
		expertise: "Product, Tech / Product Development, Marketing",
		availability: "Both",
		timeCommitment: "4 hours",
		maxStartups: "More than 3",
		startupStage: "Early Revenue",
		description: "AI engineer and startup builder with hands-on experience in product development, launching, validating ideas, and solving real-world problems.",
	},
	{
		name: "ABHIJAY SINGH",
		email: "abhijaysingh16@gmail.com",
		phone: "9767010283",
		linkedin: "https://www.linkedin.com/in/abhijay-singh-ab865226a",
		designation: "CEO & Founder",
		organization: "Drone Veda Technology OPC Pvt Ltd",
		location: "Navi Mumbai",
		experience: "2 years",
		industry: "Manufacturing, D2C, Other",
		expertise: "Fundraising, Legal / Compliance, Tech / Product Development, Product, Branding, GTM Strategy, Operations, HR",
		availability: "Both",
		timeCommitment: "4 hours",
		maxStartups: "2–3",
		startupStage: "Idea Stage",
		description: "Founder with experience across drone technology, fundraising, product development, branding, operations, and go-to-market strategy.",
	}
];

const SectionSeven: React.FC<SectionSevenProps> = ({ windowWidth }) => {
	const [activeRow, setActiveRow] = useState<number | null>(null);
	const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

	return (
		<section id="mentors-section" data-scroll-section>
			<div className={S.section}>
				<div className={S.marqueeSection}>
					<div className={S.marqueeWrapper}>
						<Marquee
							pauseOnHover
							gradient={false}
							className={S.marquee}
							speed={windowWidth > 1024 ? 15 : 80}
						>
							<p className={S.marqueeText}>Our Mentors</p>
							<p className={S.marqueeText}>Our Mentors</p>
							<p className={S.marqueeText}>Our Mentors</p>
							<p className={S.marqueeText}>Our Mentors</p>
						</Marquee>
					</div>
				</div>
				<div className={S.main}>
					<div className={S.header}>
						<p className={S.largeText}>Meet Our Mentors</p>
						<p className={S.smallText}>
							Connect with experienced founders and industry professionals who are ready to guide student entrepreneurs through every stage of building a startup.
						</p>
					</div>

					<div className={S.list}>
						{mentors.map((mentor, idx) => (
							<div
								key={idx}
								className={S.row}
								onMouseEnter={() => setActiveRow(idx)}
								onMouseLeave={() => setActiveRow(null)}
								onClick={() => setSelectedMentor(mentor)}
							>
								<div className={S.rowHeader}>
									<p className={S.eventName}>{mentor.name}</p>
									<p className={S.eventMeta}>
										{mentor.designation}
									</p>
									<p className={S.eventLocation}>{mentor.organization}</p>
								</div>
								<div
									className={`${S.rowBody} ${
										activeRow === idx ? S.rowBodyActive : ""
									}`}
								>
									<p className={S.description}>{mentor.description}</p>
									<span className={S.clickPrompt}>Click for more details</span>
								</div>
							</div>
						))}
					</div>
				</div>

				{selectedMentor && createPortal(
					<div className={S.modalOverlay} onClick={() => setSelectedMentor(null)}>
						<div className={S.modalContent} onClick={(e) => e.stopPropagation()}>
							<button className={S.closeButton} onClick={() => setSelectedMentor(null)}>&times;</button>
							<h3 className={S.modalName}>{selectedMentor.name}</h3>
							<p className={S.eventMeta}>{selectedMentor.designation} · {selectedMentor.organization}</p>
							<p className={S.modalDesc}>{selectedMentor.description}</p>
							
							<div className={S.modalDetails}>
								<div className={S.detailRow}>
									<span className={S.detailLabel}>Email:</span>
									<span className={S.detailValue}>{selectedMentor.email}</span>
								</div>
								<div className={S.detailRow}>
									<span className={S.detailLabel}>Phone:</span>
									<span className={S.detailValue}>{selectedMentor.phone}</span>
								</div>
								<div className={S.detailRow}>
									<span className={S.detailLabel}>LinkedIn:</span>
									<a className={S.detailValue} href={selectedMentor.linkedin} target="_blank" rel="noreferrer">View profile</a>
								</div>
								<div className={S.detailRow}>
									<span className={S.detailLabel}>Location / Experience:</span>
									<span className={S.detailValue}>{selectedMentor.location} · {selectedMentor.experience}</span>
								</div>
								<div className={S.detailRow}>
									<span className={S.detailLabel}>Industry:</span>
									<span className={S.detailValue}>{selectedMentor.industry}</span>
								</div>
								<div className={S.detailRow}>
									<span className={S.detailLabel}>Expertise:</span>
									<span className={S.detailValue}>{selectedMentor.expertise}</span>
								</div>
								<div className={S.detailRow}>
									<span className={S.detailLabel}>Availability:</span>
									<span className={S.detailValue}>{selectedMentor.availability} · {selectedMentor.timeCommitment}</span>
								</div>
								<div className={S.detailRow}>
									<span className={S.detailLabel}>Mentorship:</span>
									<span className={S.detailValue}>{selectedMentor.maxStartups} startups · {selectedMentor.startupStage}</span>
								</div>
							</div>
						</div>
					</div>,
					document.body
				)}
			</div>
		</section>
	);
};
export default SectionSeven;
